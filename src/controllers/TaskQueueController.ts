import { Request, Response, NextFunction } from "express";
import { TaskInfoCache } from "../data/TaskInfoCache";

export class TaskQueueController {
  constructor(private readonly taskInfo: TaskInfoCache) {}

  nextHandler = (req: Request, res: Response, next: NextFunction): void => {
    next();
  };

  updateHandler = (req: Request, res: Response, next: NextFunction): void => {
    next();
  };

  suspendHandler = (req: Request, res: Response, next: NextFunction): void => {
    next();
  };

  faultHandler = (req: Request, res: Response, next: NextFunction): void => {
    next();
  };

  completeHandler = (req: Request, res: Response, next: NextFunction): void => {
    next();
  };
}
