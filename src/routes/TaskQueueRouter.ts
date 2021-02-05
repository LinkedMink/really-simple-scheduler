import { Router } from "express";

export const taskQueueRouter = Router();

// Get the next task in the queue
taskQueueRouter.get("/:typeId", []);

// Update a task from the executor
taskQueueRouter.put("/:typeId/:id", []);

// Put a task into faulted state
taskQueueRouter.delete("/:typeId/:id", []);

// Put a task into completed state
taskQueueRouter.post("/:typeId/:id", []);
