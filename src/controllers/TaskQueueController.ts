import { Request, Response, NextFunction } from "express";
import { Types } from "mongoose";
import { ITaskDataStructures } from "../data/DataStructureFactory";
import { TaskEvent, TaskEventDispatch } from "../data/TaskEvents";
import { TaskTypeData } from "../data/TaskTypeData";
import { Logger } from "../infastructure/Logger";
import { ITask } from "../models/database/Task";
import { taskMapper } from "../models/mappers/TaskMapper";
import { response } from "../models/responses/IResponseData";
import { getUserRequestError } from "./MessageFunc";

export class TaskQueueController {
  private readonly logger = Logger.get(TaskQueueController.name);

  constructor(
    private readonly taskInfo: TaskTypeData,
    private readonly taskDispatch: TaskEventDispatch
  ) {}

  nextHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const data = this.getDataStructures(req, res);
    if (!data) return;

    const task = await data.scheduledQueue.peek();
    if (task) {
      res.send(response.success(taskMapper.convertToFrontend(task)));
    } else {
      res.send(response.failed());
      res.status(404);
    }
  };

  updateHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const data = this.getDataStructures(req, res);
    if (!data) return;

    const task = await this.getRunningTask(req, res, data);
    if (!task) return;

    this.taskDispatch.emit(TaskEvent.Progressed, task, req.body);
  };

  suspendHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const data = this.getDataStructures(req, res);
    if (!data) return;

    const task = await this.getRunningTask(req, res, data);
    if (!task) return;

    this.taskDispatch.emit(TaskEvent.Suspended, task, req.body);
  };

  faultHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const data = this.getDataStructures(req, res);
    if (!data) return;

    const task = await this.getRunningTask(req, res, data);
    if (!task) return;

    this.taskDispatch.emit(TaskEvent.Failed, task, req.body);
  };

  completeHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const data = this.getDataStructures(req, res);
    if (!data) return;

    const task = await this.getRunningTask(req, res, data);
    if (!task) return;

    this.taskDispatch.emit(TaskEvent.Completed, task, req.body);
  };

  private async getRunningTask(req: Request, res: Response, data: ITaskDataStructures<ITask>) {
    const task = await data.runningSet.get(Types.ObjectId(req.params.id));
    if (!task) {
      this.logger.info(`${getUserRequestError(req)}: requested id not found`);
      res.send(404);
      res.send(response.failed(`id=${req.params.id} does not exist`));
      return null;
    }
    return task;
  }

  private getDataStructures(req: Request, res: Response) {
    const type = this.taskInfo.tasks.get(req.params.typeName);
    if (!type) {
      this.logger.info(`${getUserRequestError(req)}: requested type not found`);
      res.send(400);
      res.send(response.failed(`typeName=${req.params.typeName} is not a valid task type`));
      return null;
    }
    return type;
  }
}
