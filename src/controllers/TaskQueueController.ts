import { Request, Response, NextFunction } from "express";
import { TaskTypeData } from "../data/TaskTypeData";
import { Logger } from "../infastructure/Logger";
import { IUserSession } from "../middleware/Passport";

export class TaskQueueController {
  private readonly logger = Logger.get(TaskQueueController.name);
  
  constructor(private readonly taskInfo: TaskTypeData) {}

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
