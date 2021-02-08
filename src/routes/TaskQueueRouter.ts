import { Router } from "express";
import { TaskQueueController } from "../controllers/TaskQueueController";
import { TaskInfoCache } from "../data/TaskInfoCache";

export const getTaskQueueRouter = (taskInfo: TaskInfoCache): Router => {
  const taskQueueRouter = Router();
  const controller = new TaskQueueController(taskInfo);

  taskQueueRouter.get("/:typeId", [controller.nextHandler]);

  taskQueueRouter.patch("/:typeId/:id", [controller.updateHandler]);

  taskQueueRouter.put("/:typeId/:id", [controller.suspendHandler]);

  taskQueueRouter.delete("/:typeId/:id", [controller.faultHandler]);

  taskQueueRouter.post("/:typeId/:id", [controller.completeHandler]);

  return taskQueueRouter;
};
