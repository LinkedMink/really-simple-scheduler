import { Socket }  from "socket.io";
import { Request, Response, NextFunction } from "express";
import { TaskTypeData } from "../data/TaskTypeData";
import { Logger } from "../infastructure/Logger";
import { IUserSession } from "../middleware/Passport";
import { IProgressModel } from "../models/responses/IProgressModel";

export class TaskRunController {
  private readonly logger = Logger.get(TaskRunController.name);

  constructor(private readonly socket: Socket) {}
  
  initiateHandler = (taskId: string): void => {
    return;
  }

  reportProgressHandler = (progress: IProgressModel): void => {
    return;
  }
}
