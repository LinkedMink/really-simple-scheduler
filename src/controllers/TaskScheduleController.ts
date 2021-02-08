import { Request, Response, NextFunction } from "express";
import { TaskInfoCache } from "../data/TaskInfoCache";

export class TaskScheduleController {
  constructor(private readonly taskInfo: TaskInfoCache) {}

  searchHandler = (req: Request, res: Response, next: NextFunction): void => {
    next();
  };

  listHandler = (req: Request, res: Response, next: NextFunction): void => {
    next();
  };

  getHandler = (req: Request, res: Response, next: NextFunction): void => {
    next();
  };

  scheduleHandler = (req: Request, res: Response, next: NextFunction): void => {
    next();
  };

  cancelHandler = (req: Request, res: Response, next: NextFunction): void => {
    next();
  };
}
