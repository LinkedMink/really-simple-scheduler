import { Request, Router } from "express";
import { TaskScheduleController } from "../controllers/TaskScheduleController";
import { taskEventExchange } from "../data/TaskEvents";
import { TaskTypeData } from "../data/TaskTypeData";
import { authenticateJwt, authorizeJwtClaimByResource } from "../middleware/Authorization";

export const getTaskScheduleRouter = (taskInfo: TaskTypeData): Router => {
  const taskScheduleRouter = Router();
  const controller = new TaskScheduleController(taskInfo, taskEventExchange);

  const authorizeReadHandler = authorizeJwtClaimByResource(
    taskInfo.permissionMap,
    (req: Request) => req.params.typeName + "Read"
  );

  const authorizeScheduleHandler = authorizeJwtClaimByResource(
    taskInfo.permissionMap,
    (req: Request) => req.params.typeName + "Schedule"
  );

  taskScheduleRouter.get("/:typeName/search", [
    authenticateJwt,
    authorizeReadHandler,
    controller.searchHandler
  ]);

  taskScheduleRouter.get("/:typeName", [
    authenticateJwt,
    authorizeReadHandler,
    controller.listHandler
  ]);

  taskScheduleRouter.get("/:typeName/:id", [
    authenticateJwt,
    authorizeReadHandler,
    controller.getHandler
  ]);

  taskScheduleRouter.post("/:typeName", [
    authenticateJwt,
    authorizeScheduleHandler,
    controller.scheduleHandler
  ]);

  taskScheduleRouter.delete("/:typeName/:id", [
    authenticateJwt,
    authorizeScheduleHandler,
    controller.cancelHandler
  ]);

  return taskScheduleRouter;
};
