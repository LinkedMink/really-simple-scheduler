import { Request, Router } from "express";
import { TaskQueueController } from "../controllers/TaskQueueController";
import { TaskEventDispatch } from "../data/TaskEvents";
import { TaskTypeData } from "../data/TaskTypeData";
import { authenticateJwt, authorizeJwtClaimByRequest } from "../middleware/Authorization";

export const getTaskQueueRouter = (
  taskInfo: TaskTypeData,
  taskDispatch: TaskEventDispatch
): Router => {
  const taskQueueRouter = Router();
  const controller = new TaskQueueController(taskInfo, taskDispatch);

  const authorizeManageHandler = authorizeJwtClaimByRequest(
    taskInfo.permissions,
    (req: Request) => req.params.typeName + "Manage"
  );

  taskQueueRouter.get("/:typeName", [
    authenticateJwt,
    authorizeManageHandler,
    controller.nextHandler,
  ]);

  taskQueueRouter.patch("/:typeName/:id", [
    authenticateJwt,
    authorizeManageHandler,
    controller.updateHandler,
  ]);

  taskQueueRouter.put("/:typeName/:id", [
    authenticateJwt,
    authorizeManageHandler,
    controller.suspendHandler,
  ]);

  taskQueueRouter.delete("/:typeName/:id", [
    authenticateJwt,
    authorizeManageHandler,
    controller.faultHandler,
  ]);

  taskQueueRouter.post("/:typeName/:id", [
    authenticateJwt,
    authorizeManageHandler,
    controller.completeHandler,
  ]);

  return taskQueueRouter;
};
