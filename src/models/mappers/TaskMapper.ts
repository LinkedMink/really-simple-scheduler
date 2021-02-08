import { Model } from "mongoose";
import { IProgress, ITask, Task } from "../database/Task";
import { IPermissionClaim } from "../database/PermissionClaim";
import { ITaskModel } from "../responses/ITaskModel";
import { IModelMapper, mapTrackedEntity, setUserModifier } from "./IModelMapper";
import { taskTypeMapper } from "./TaskTypeMapper";
import { ITaskType } from "../database/TaskType";

export class TaskMapper implements IModelMapper<ITaskModel, ITask> {
  constructor(private readonly dbModel: Model<ITask>) {}

  public convertToFrontend = (model: ITask): ITaskModel => {
    let returnModel: Partial<ITaskModel> = {
      taskType: taskTypeMapper.convertToFrontend(model.taskType),
      scheduledDateTime: model.scheduledDateTime,
      startDateTime: model.startDateTime,
      endDateTime: model.endDateTime,
      runTimeMs: model.runTimeMs,
      parameters: model.parameters,
      result: model.result,
      status: model.status,
      progress: model.progress,
      state: model.state,
    };

    returnModel = mapTrackedEntity(model, returnModel as ITaskModel);

    return returnModel as ITaskModel;
  };

  public convertToBackend = (
    model: ITaskModel,
    existing?: ITask | undefined,
    modifier?: string
  ): ITask => {
    let returnModel: Partial<ITask> = existing ?? {};

    if (modifier) {
      returnModel = setUserModifier(returnModel, modifier);
    }

    (returnModel.taskType = taskTypeMapper.convertToBackend(model.taskType)),
      (returnModel.scheduledDateTime = model.scheduledDateTime),
      (returnModel.startDateTime = model.startDateTime),
      (returnModel.endDateTime = model.endDateTime),
      (returnModel.runTimeMs = model.runTimeMs),
      (returnModel.parameters = model.parameters),
      (returnModel.result = model.result),
      (returnModel.status = model.status),
      (returnModel.progress = model.progress as IProgress),
      (returnModel.state = model.state);

    return new this.dbModel(returnModel);
  };
}

export const taskMapper = new TaskMapper(Task);
