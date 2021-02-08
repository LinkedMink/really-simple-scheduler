import { TaskStatus } from "../database/Task";
import { IBaseTaskModel } from "./IBaseTaskModel";
import { IProgressModel } from "./IProgressModel";

export interface ITaskModel<
  TResult = unknown,
  TParams = unknown,
  TState = unknown,
  TResultSample = unknown
> extends IBaseTaskModel<TResult, TParams> {
  status: TaskStatus;
  progress?: IProgressModel<TResultSample>;
  state?: TState;
}
