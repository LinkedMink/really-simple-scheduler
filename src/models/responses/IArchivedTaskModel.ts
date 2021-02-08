import { ArchivedTaskStatus } from "../database/ArchivedTask";
import { IBaseTaskModel } from "./IBaseTaskModel";

export interface IArchivedTaskModel<TResult = unknown, TParams = unknown>
  extends IBaseTaskModel<TResult, TParams> {
  status: ArchivedTaskStatus;
}
