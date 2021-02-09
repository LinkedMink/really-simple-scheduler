import { SchemaTypes, Types } from "mongoose";
import { ITaskType, taskTypeSchema } from "./TaskType";
import { IUserEntity, userEntitySchemaDefinition } from "./UserEntity";

export const baseTaskSchemaDefinition = Object.assign({}, userEntitySchemaDefinition, {
  taskTypeName: {
    type: SchemaTypes.String,
    index: true,
    required: true,
  },
  taskType: taskTypeSchema,
  scheduledDateTime: {
    type: SchemaTypes.Date,
    required: true,
  },
  startDateTime: {
    type: SchemaTypes.Date,
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
  taskTypeName: string;
  taskType: ITaskType;
  scheduledDateTime: Date;
  startDateTime?: Date;
  endDateTime?: Date;
  runTimeMs?: number;
  parameters?: TParams;
  result?: TResult;
}
