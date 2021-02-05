import { ArchivedTaskStatus } from "../database/ArchivedTask";
import { IBaseTaskModel } from "./IBaseTaskModel";

export interface ITaskEntityModel<TResult = unknown, TParams = unknown>
  extends IBaseTaskModel<TResult, TParams> {
  status: ArchivedTaskStatus;
}
