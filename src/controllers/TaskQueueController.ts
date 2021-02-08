import { Request, Response, NextFunction } from "express";
import { TaskInfoCache } from "../data/TaskInfoCache";
import { Logger } from "../infastructure/Logger";
import { IUserSession } from "../middleware/Passport";

export class TaskQueueController {
  private readonly logger = Logger.get(TaskQueueController.name);
  
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
