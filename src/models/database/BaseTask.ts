import { SchemaTypes, Types } from "mongoose";
import { ITaskType, TaskType, taskTypeSchema } from "./TaskType";
import { IUserEntity, userEntitySchemaDefinition } from "./UserEntity";

export const baseTaskSchemaDefinition = Object.assign({}, userEntitySchemaDefinition, {
  taskType: taskTypeSchema,
  startDateTime: {
    type: SchemaTypes.Date,
    required: true,
  },
  endDateTime: {
    type: SchemaTypes.Date,
  },
  runTimeMs: {
    type: SchemaTypes.Number,
  },
  parameters: {
    type: SchemaTypes.Mixed,
  },
  result: {
    type: SchemaTypes.Mixed,
  },
});

export interface IBaseTask<TResult = unknown, TParams = unknown> extends IUserEntity {
  taskTypeId: Types.ObjectId;
  taskType: ITaskType;
  startDateTime: Date;
  endDateTime?: Date;
  runTimeMs?: number;
  parameters?: TParams;
  result?: TResult;
}
