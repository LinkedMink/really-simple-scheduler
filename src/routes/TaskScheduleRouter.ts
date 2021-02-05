import { Router } from "express";

export const taskScheduleRouter = Router();

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
