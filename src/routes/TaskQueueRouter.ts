import { Router } from "express";
import { TaskInfoCache } from "../data/TaskInfoCache";

export const getTaskQueueRouter = async (): Promise<Router> => {
  const taskQueueRouter = Router();

  const taskInfo = TaskInfoCache.get();
  await taskInfo.load();

  // Get the next task in the queue
  taskQueueRouter.get("/:typeId", []);

  // Update a task from the executor
  taskQueueRouter.patch("/:typeId/:id", []);

  // Suspend a task from the executor
  taskQueueRouter.put("/:typeId/:id", []);

  // Put a task into faulted state
  taskQueueRouter.delete("/:typeId/:id", []);

  // Put a task into completed state
  taskQueueRouter.post("/:typeId/:id", []);

  return taskQueueRouter;
};
