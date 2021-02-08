import { createCrudRouter, filterByUserId } from "../infastructure/CreateCrudRouter";
import { AuthorizationClaim, authorizeUserOwned } from "../middleware/Authorization";
import { taskTypeMapper } from "../models/mappers/TaskTypeMapper";
import { TaskType } from "../models/database/TaskType";

export const taskTypeRouter = createCrudRouter(
  TaskType,
  taskTypeMapper,
  AuthorizationClaim.TaskTypeRead,
  AuthorizationClaim.TaskTypeWrite,
  authorizeUserOwned,
  filterByUserId
);
