import { Model } from "mongoose";
import { ITaskType, TaskType } from "../database/TaskType";
import { IPermissionClaim } from "../database/PermissionClaim";
import { ITaskTypeModel } from "../responses/ITaskTypeModel";
import { IModelMapper, mapTrackedEntity, setUserModifier } from "./IModelMapper";

export class TaskTypeMapper implements IModelMapper<ITaskTypeModel, ITaskType> {
  constructor(private readonly dbModel: Model<ITaskType>) {}

  public convertToFrontend = (model: ITaskType): ITaskTypeModel => {
    let returnModel: ITaskTypeModel = {
      name: model.name,
      description: model.description,
      permissions: model.permissions,
      isProgressReported: model.isProgressReported,
      isSuspendable: model.isSuspendable,
      isCancelable: model.isCancelable,
      keepInactiveForMinutes: model.keepInactiveForMinutes,
      parameterSchema: model.parameterSchema,
    };

    returnModel = mapTrackedEntity(model, returnModel);

    return returnModel;
  };

  public convertToBackend = (
    model: ITaskTypeModel,
    existing?: ITaskType | undefined,
    modifier?: string
  ): ITaskType => {
    let returnModel: Partial<ITaskType> = existing ?? {};

    if (modifier) {
      returnModel = setUserModifier(returnModel, modifier);
    }

    (returnModel.name = model.name),
      (returnModel.description = model.description),
      (returnModel.permissions = model.permissions as IPermissionClaim),
      (returnModel.isProgressReported = model.isProgressReported),
      (returnModel.isSuspendable = model.isSuspendable),
      (returnModel.isCancelable = model.isCancelable),
      (returnModel.keepInactiveForMinutes = model.keepInactiveForMinutes),
      (returnModel.parameterSchema = model.parameterSchema);

    return new this.dbModel(returnModel);
  };
}

export const taskTypeMapper = new TaskTypeMapper(TaskType);
