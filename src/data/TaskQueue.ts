import { IAgingCache } from "@linkedmink/multilevel-aging-cache";
import { Types } from "mongoose";
import { ITask } from "../models/database/Task";

export class TaskQueue<T extends ITask> {
  constructor(
    private readonly cache: IAgingCache<Types.ObjectId, T>
  ) {}
}
