import { model, Schema, SchemaTypes } from "mongoose";
import { IBaseTask, baseTaskSchemaDefinition } from "./BaseTask";
import { trackedEntityPreValidateFunc } from "./TrackedEntity";

export enum ArchivedTaskStatus {
  Faulted = "faulted",
  Complete = "complete",
  Canceled = "canceled",
}

export const archivedTaskSchemaDefinition = Object.assign({}, baseTaskSchemaDefinition, {
  status: {
    type: SchemaTypes.String,
    enum: Object.values(ArchivedTaskStatus),
    required: true,
  },
});

export const archivedTaskSchema = new Schema(archivedTaskSchemaDefinition);
archivedTaskSchema.pre("validate", trackedEntityPreValidateFunc);

export interface IArchivedTask<TResult = unknown, TParams = unknown>
  extends IBaseTask<TResult, TParams> {
  status: ArchivedTaskStatus;
}

export const ArchivedTask = model<IBaseTask>("Archived-Task", archivedTaskSchema);
