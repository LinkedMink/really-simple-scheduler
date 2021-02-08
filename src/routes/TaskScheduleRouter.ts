import { Router } from "express";
import { TaskScheduleController } from "../controllers/TaskScheduleController";
import { TaskInfoCache } from "../data/TaskInfoCache";

export const getTaskScheduleRouter = (taskInfo: TaskInfoCache): Router => {
  const taskScheduleRouter = Router();
  const controller = new TaskScheduleController(taskInfo);

  taskScheduleRouter.get("/search", [controller.searchHandler]);

  taskScheduleRouter.get("/", [controller.listHandler]);

  taskScheduleRouter.get("/:id", [controller.getHandler]);

  taskScheduleRouter.post("/", [controller.scheduleHandler]);

  taskScheduleRouter.delete("/:id", [controller.cancelHandler]);

  return taskScheduleRouter;
};
