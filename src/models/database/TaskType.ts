import { SchemaTypes, Schema, model } from "mongoose";
import { IPermissionClaim, permissionClaim } from "./PermissionClaim";
import {
  ITrackedEntity,
  trackedEntityPreValidateFunc,
  trackedEntitySchemaDefinition,
} from "./TrackedEntity";

const taskTypeSchemaDefinition = Object.assign({}, trackedEntitySchemaDefinition, {
  name: {
    type: SchemaTypes.String,
    index: true,
    unique: true,
    required: true,
  },
  description: {
    type: SchemaTypes.String,
  },
  permissions: permissionClaim,
  isProgressReported: {
    type: SchemaTypes.Boolean,
    required: true,
  },
  isSuspendable: {
    type: SchemaTypes.Boolean,
    required: true,
  },
  isCancelable: {
    type: SchemaTypes.Boolean,
    required: true,
  },
  keepInactiveForMinutes: {
    type: SchemaTypes.Number,
    required: true,
  },
  parameterSchema: {
    type: SchemaTypes.Mixed,
  },
});

export const taskTypeSchema = new Schema(taskTypeSchemaDefinition);
taskTypeSchema.pre("validate", trackedEntityPreValidateFunc);

export interface ITaskType<TParams = unknown> extends ITrackedEntity {
  name: string;
  description?: string;
  permissions?: IPermissionClaim;
  isProgressReported: boolean;
  isSuspendable: boolean;
  isCancelable: boolean;
  keepInactiveForMinutes: number;
  parameterSchema: TParams;
}

export const TaskType = model<ITaskType>("Task-Type", taskTypeSchema);
