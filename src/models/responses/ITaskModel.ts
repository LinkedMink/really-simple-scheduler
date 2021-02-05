import { TaskStatus } from "../database/Task";
import { IBaseTaskModel } from "./IBaseTaskModel";

export interface IProgress<T> {
  completedRatio: number;
  estimatedCompletedBy?: Date;
  resultSample?: T;
}

export interface ITask<
  TResult = unknown,
  TParams = unknown,
  TState = unknown,
  TResultSample = unknown
> extends IBaseTaskModel<TResult, TParams> {
  status: TaskStatus;
  progress?: IProgress<TResultSample>;
  state?: TState;
}
