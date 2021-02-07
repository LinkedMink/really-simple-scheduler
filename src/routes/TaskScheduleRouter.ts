import { Router } from "express";
import { TaskInfoCache } from "../data/TaskInfoCache";

export const getTaskScheduleRouter = async (): Promise<Router> => {
  const taskScheduleRouter = Router();

  const taskInfo = TaskInfoCache.get();
  await taskInfo.load();

  // Search active task
  taskScheduleRouter.get("/list", []);

  // Get a user's active Task
  taskScheduleRouter.get("/", []);

  // Get details of 1 task
  taskScheduleRouter.get("/:id", []);

  // Schedule a new task
  taskScheduleRouter.post("/", []);

  // Cancel a task in progress
  taskScheduleRouter.delete("/:id", []);

  return taskScheduleRouter;
};
