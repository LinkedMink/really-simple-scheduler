import { Request, Response, NextFunction } from "express";
import { FilterQuery, Query } from "mongoose";
import { TaskEvent, TaskEventEmitter } from "../data/TaskEvents";
import { TaskTypeData } from "../data/TaskTypeData";
import { Logger } from "../infastructure/Logger";
import { IUserSession } from "../middleware/Passport";
import { ITask, Task, TaskStatus } from "../models/database/Task";
import { taskMapper } from "../models/mappers/TaskMapper";
import { IScheduleRequest } from "../models/requests";
import { IListRequest } from "../models/requests/IListRequest";
import { response } from "../models/responses/IResponseData";

const DEFAULT_ITEMS_PER_PAGE = 20;

export class TaskScheduleController {
  private readonly logger = Logger.get(TaskScheduleController.name);
  
  constructor(
    private readonly taskInfo: TaskTypeData,
    private readonly taskEventEmitter: TaskEventEmitter
  ) {}

  searchHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const filter = this.getRequestFilter(req, res);
    if (!filter) return;

    const reqData = req.query as IListRequest<ITask>;

    let query: Query<ITask[], ITask>;
    const conditions = reqData.query ? {...reqData.query, ...filter} : filter

    try {
      query = Task.find(conditions);
    } catch (e) {
      this.logger.info(`${this.getErrorPrefix(req)}: bad query params`);
      res.status(400);
      res.send(response.failed("The supplied query is invalid"));
      return;
    }

    if (reqData.sort) {
      try {
        query = query.sort(reqData.sort);
      } catch (e) {
        this.logger.info(`${this.getErrorPrefix(req)}: bad sort params`);
        res.status(400);
        res.send(response.failed("The supplied sort is invalid"));
        return;
      }
    }

    const itemsPerPage = reqData.pageSize ?? DEFAULT_ITEMS_PER_PAGE;
    query = query.limit(itemsPerPage);

    if (reqData.pageNumber) {
      query = query.skip(itemsPerPage * reqData.pageNumber);
    }

    const result = await query.exec();

    const responseData = result.map(taskMapper.convertToFrontend);
    res.send(response.success(responseData));
  };

  listHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const filter = this.getRequestFilter(req, res);
    if (!filter) return;

    const entities = await Task.find(filter).exec();
    const output = entities.map(taskMapper.convertToFrontend)
    res.send(response.success(output));
  };

  getHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const filter = this.getRequestFilter(req, res);
    if (!filter) return;

    filter.id = req.params.id

    const entity = await Task.findOne(filter).exec();
    if (entity) {
      res.send(response.success(taskMapper.convertToFrontend(entity)));
    } else {
      this.logger.info(`${this.getErrorPrefix(req)}: requested not found`);
      res.status(404);
      res.send(response.failed(`Failed to find ID: ${req.params.id}`));
    }
  };

  scheduleHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const type = this.taskInfo.typeMap.get(req.params.typeName)
    if (!type) {
      this.logger.info(`${this.getErrorPrefix(req)}: requested not found`);
      res.send(400);
      res.send(response.failed(`typeName=${req.params.typeName} is not a valid task type`));
      return;
    }

    const task = new Task({
      taskTypeId: type.id,
      taskType: type,
      scheduledDateTime: new Date(),
      parameters: (req.body as IScheduleRequest).parameters,
      status: TaskStatus.Scheduled,
      progress: type.isProgressReported ? { completedRatio: 0 } : undefined
    })

    await new Promise<void>((resolve, reject) => {
      task.save((error, doc) => {
        if (error) {
          this.logger.error({ message: error });
          res.status(500).send(response.failed());
          return resolve();
        }

        this.taskEventEmitter.emit(TaskEvent.Scheduled, task);

        res.send(response.success(taskMapper.convertToFrontend(doc)));
        resolve();
      });
    });
  };

  cancelHandler = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const type = this.taskInfo.typeMap.get(req.params.typeName)
    if (!type) {
      this.logger.info(`${this.getErrorPrefix(req)}: requested not found`);
      res.send(400);
      res.send(response.failed(`typeName=${req.params.typeName} is not a valid task type`));
      return;
    }

    if (!type.isCancelable) {
      this.logger.info(`${this.getErrorPrefix(req)}: requested not cancelable`);
      res.send(400);
      res.send(response.failed(`typeName=${req.params.typeName} can not be canceled`));
      return;
    }

    const task = await Task.findOne({
      id: req.params.id,
      userId: (req.user as IUserSession).sub,
      taskTypeId: type.id
    }).exec();

    if (!task) {
      res.status(404);
      res.send(response.failed(`Failed to find ID: ${req.params.id}`));
    }

    this.taskEventEmitter.emit(TaskEvent.Scheduled, task);

    res.send(response.success());
  };

  private getRequestFilter(req: Request, res: Response): FilterQuery<ITask> | void {
    const type = this.taskInfo.typeMap.get(req.params.typeName)
    if (!type) {
      this.logger.info(`${this.getErrorPrefix(req)}: requested not found`);
      res.send(400);
      res.send(response.failed(`typeName=${req.params.typeName} is not a valid task type`));
      return;
    }

    return {
      userId: (req.user as IUserSession).sub,
      taskTypeId: type.id
    }
  }

  private getErrorPrefix(req: Request) {
    const params = Object.keys(req.params).length > 0
      ? `,params=${JSON.stringify(req.params)}`
      : ''
    return `User=${(req.user as IUserSession).sub},${params}`
  }
}
