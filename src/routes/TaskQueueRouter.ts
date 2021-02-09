import { Request, Router } from "express";
import { TaskQueueController } from "../controllers/TaskQueueController";
import { TaskTypeData } from "../data/TaskTypeData";
import { authenticateJwt, authorizeJwtClaimByResource } from "../middleware/Authorization";

export const getTaskQueueRouter = (taskInfo: TaskTypeData): Router => {
  const taskQueueRouter = Router();
  const controller = new TaskQueueController(taskInfo);

  const authorizeManageHandler = authorizeJwtClaimByResource(
    taskInfo.permissionMap,
    (req: Request) => req.params.typeName + "Manage"
  );

  taskQueueRouter.get("/:typeName", [
    authenticateJwt,
    authorizeManageHandler,
    controller.nextHandler
  ]);

  taskQueueRouter.patch("/:typeName/:id", [
    authenticateJwt,
    authorizeManageHandler,
    controller.updateHandler
  ]);

  taskQueueRouter.put("/:typeName/:id", [
    authenticateJwt,
    authorizeManageHandler,
    controller.suspendHandler
  ]);

  taskQueueRouter.delete("/:typeName/:id", [
    authenticateJwt,
    authorizeManageHandler,
    controller.faultHandler
  ]);

  taskQueueRouter.post("/:typeName/:id", [
    authenticateJwt,
    authorizeManageHandler,
    controller.completeHandler
  ]);

  return taskQueueRouter;
};
