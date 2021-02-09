import { model, Schema, SchemaTypes, Types } from "mongoose";
import { trackedEntityPreValidateFunc } from "./TrackedEntity";

import { IBaseTask, baseTaskSchemaDefinition } from "./BaseTask";

export enum TaskStatus {
  Scheduled = "scheduled",
  Running = "running",
  Suspended = "suspended",
  Faulted = "faulted",
  Complete = "complete",
  Canceled = "canceled",
}

const progressSchemaDefinition = {
  completedRatio: {
    type: SchemaTypes.Number,
    required: true,
  },
  estimatedCompletedBy: {
    type: SchemaTypes.Date,
  },
  resultSample: {
    type: SchemaTypes.Mixed,
  },
};

const progressSchema = new Schema(progressSchemaDefinition);

export interface IProgress<T = unknown> extends Types.Subdocument {
  completedRatio: number;
  estimatedCompletedBy?: Date;
  resultSample?: T;
}

const taskSchemaDefinition = Object.assign({}, baseTaskSchemaDefinition, {
  status: {
    type: SchemaTypes.String,
    enum: Object.values(TaskStatus),
    required: true,
  },
  progress: progressSchema,
  state: {
    type: SchemaTypes.Mixed,
  },
});

const options = { discriminatorKey: 'taskTypeName' };
export const taskSchema = new Schema(taskSchemaDefinition, options);
taskSchema.pre("validate", trackedEntityPreValidateFunc);

export interface ITask<
  TResult = unknown,
  TParams = unknown,
  TState = unknown,
  TResultSample = unknown
> extends IBaseTask<TResult, TParams> {
  status: TaskStatus;
  progress?: IProgress<TResultSample>;
  state?: TState;
}

export const Task = model<ITask>("Task", taskSchema);
