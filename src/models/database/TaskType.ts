import { SchemaTypes, Schema, model } from "mongoose";
import { openapiV2 } from "@apidevtools/openapi-schemas";
import { OpenAPIV3 } from "openapi-types";
import ZSchema from "z-schema";
import { IPermissionClaim, permissionClaim } from "./PermissionClaim";
import { trackedEntityPreValidateFunc } from "./TrackedEntity";
import { userEntitySchemaDefinition, IUserEntity } from "./UserEntity";

const schemaValidator = new ZSchema({});
const validateOpenApiSchema = {
  validator: function (value?: string) {
    return (
      !value ||
      schemaValidator.validate(
        value,
        openapiV2,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { schemaPath: "definitions.schema" } as any
      )
    );
  },
  message: (props: Record<string, unknown>) => {
    const error = schemaValidator.getLastError();
    return `Not a valid OpenAPI schema: ${error.message}, ${error.stack}`;
  },
};

const taskTypeSchemaDefinition = Object.assign({}, userEntitySchemaDefinition, {
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
    validate: validateOpenApiSchema,
  },
  resultSchema: {
    type: SchemaTypes.Mixed,
    validate: validateOpenApiSchema,
  },
  progressSchema: {
    type: SchemaTypes.Mixed,
    validate: validateOpenApiSchema,
  },
});

export const taskTypeSchema = new Schema(taskTypeSchemaDefinition);
taskTypeSchema.pre("validate", trackedEntityPreValidateFunc);

export interface ITaskType extends IUserEntity {
  name: string;
  description?: string;
  permissions?: IPermissionClaim;
  isProgressReported: boolean;
  isSuspendable: boolean;
  isCancelable: boolean;
  keepInactiveForMinutes: number;
  parameterSchema?: OpenAPIV3.SchemaObject;
  resultSchema?: OpenAPIV3.SchemaObject;
  progressSchema?: OpenAPIV3.SchemaObject;
}

export const TaskType = model<ITaskType>("Task-Type", taskTypeSchema);
