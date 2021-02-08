import { ITaskTypeModel } from "./ITaskTypeModel";
import { IUserEntityModel } from "./IUserEntityModel";

export interface IBaseTaskModel<TResult = unknown, TParams = unknown> extends IUserEntityModel {
  taskTypeId: string;
  taskType: ITaskTypeModel;
  scheduledDateTime: Date;
  startDateTime?: Date;
  endDateTime?: Date;
  runTimeMs?: number;
  parameters?: TParams;
  result?: TResult;
}
