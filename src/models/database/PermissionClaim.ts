import { Schema, SchemaTypes, Types } from "mongoose";

const permissionClaimDefinition = {
  baseClaimName: {
    type: SchemaTypes.String,
    validate: {
      validator: function (this: IPermissionClaim, value?: string) {
        return !value || (!this.readClaim && !this.scheduleClaim && !this.manageClaim);
      },
      message: "baseClaimName is used to automatically determine read, schedule, and manage names",
    },
  },
  readClaim: {
    type: SchemaTypes.String,
    validate: {
      validator: function (this: IPermissionClaim, value?: string) {
        return !value || (this.scheduleClaim && this.manageClaim);
      },
      message: "More strict claims scheduleClaim and manageClaim must be set to restrict read",
    },
  },
  scheduleClaim: {
    type: SchemaTypes.String,
    validate: {
      validator: function (this: IPermissionClaim, value?: string) {
        return !value || this.manageClaim;
      },
      message: "More strict claim manageClaim must be set to restrict schedule",
    },
  },
  manageClaim: {
    type: SchemaTypes.String,
  },
};

export const permissionClaim = new Schema(permissionClaimDefinition);

export interface IPermissionClaim extends Types.Subdocument {
  baseClaimName?: string;
  readClaim?: string;
  scheduleClaim?: string;
  manageClaim?: string;
}
