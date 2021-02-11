import { Request } from "express";
import { IUserSession } from "../middleware/Passport";

export function getUserRequestError(req: Request): string {
  const params = Object.keys(req.params).length > 0 ? `,params=${JSON.stringify(req.params)}` : "";
  return `User=${(req.user as IUserSession).sub},${params}`;
}
