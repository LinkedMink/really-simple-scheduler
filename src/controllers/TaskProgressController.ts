import { Socket }  from "socket.io";
import { Request, Response, NextFunction } from "express";
import { TaskTypeData } from "../data/TaskTypeData";
import { Logger } from "../infastructure/Logger";
import { IUserSession } from "../middleware/Passport";

export class TaskProgressController {
  private readonly logger = Logger.get(TaskProgressController.name);

  constructor(private readonly socket: Socket) {}
  
  cancelHandler = (taskId: string): void => {
    return;
  }
}
