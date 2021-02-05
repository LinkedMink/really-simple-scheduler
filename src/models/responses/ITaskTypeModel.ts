import { IPermissionClaimModel } from "./IPermissionClaimModel";
import { ITrackedEntityModel } from "./ITrackedEntityModel";

export interface ITaskTypeModel<TParams = unknown> extends ITrackedEntityModel {
  name: string;
  description?: string;
  permissions?: IPermissionClaimModel;
  isProgressReported: boolean;
  isSuspendable: boolean;
  isCancelable: boolean;
  keepInactiveForMinutes: number;
  parameterSchema: TParams;
}
