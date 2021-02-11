import { Request, Router } from "express";
import { TaskScheduleController } from "../controllers/TaskScheduleController";
import { TaskEventDispatch } from "../data/TaskEvents";
import { TaskTypeData } from "../data/TaskTypeData";
import { authenticateJwt, authorizeJwtClaimByRequest } from "../middleware/Authorization";

export const getTaskScheduleRouter = (
  taskInfo: TaskTypeData,
  taskDispatch: TaskEventDispatch
): Router => {
  const taskScheduleRouter = Router();
  const controller = new TaskScheduleController(taskInfo, taskDispatch);

  const authorizeReadHandler = authorizeJwtClaimByRequest(
    taskInfo.permissions,
    (req: Request) => req.params.typeName + "Read"
  );

  const authorizeScheduleHandler = authorizeJwtClaimByRequest(
    taskInfo.permissions,
    (req: Request) => req.params.typeName + "Schedule"
  );

  taskScheduleRouter.get("/:typeName/search", [
    authenticateJwt,
    authorizeReadHandler,
    controller.searchHandler,
  ]);

  taskScheduleRouter.get("/:typeName", [
    authenticateJwt,
    authorizeReadHandler,
    controller.listHandler,
  ]);

  taskScheduleRouter.get("/:typeName/:id", [
    authenticateJwt,
    authorizeReadHandler,
    controller.getHandler,
  ]);

  taskScheduleRouter.post("/:typeName", [
    authenticateJwt,
    authorizeScheduleHandler,
    controller.scheduleHandler,
  ]);

  taskScheduleRouter.delete("/:typeName/:id", [
    authenticateJwt,
    authorizeScheduleHandler,
    controller.cancelHandler,
  ]);

  return taskScheduleRouter;
};
