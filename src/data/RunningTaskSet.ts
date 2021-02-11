import { IAgingCache } from "@linkedmink/multilevel-aging-cache";
import { EventEmitter } from "events";
import { Types } from "mongoose";
import { Logger } from "../infastructure/Logger";
import { IProgress, ITask, TaskStatus } from "../models/database/Task";

export class RunningTaskSet<T extends ITask> extends EventEmitter {
  private readonly logger = Logger.get(RunningTaskSet.name);

  constructor(private readonly cache: IAgingCache<Types.ObjectId, T>) {
    super();
  }

  get = this.cache.get.bind(this.cache);

  start = async (task: T): Promise<void> => {
    task.status = TaskStatus.Running;
    await this.cache.set(task._id, task);
  };

  fault = async (task: T, reason: unknown): Promise<void> => {
    task.status = TaskStatus.Faulted;
    task.result = reason;
    await this.cache.set(task._id, task);
    await this.cache.clear(task._id);
  };

  cancel = async (task: T): Promise<void> => {
    task.status = TaskStatus.Canceled;
    await this.cache.set(task._id, task);
    await this.cache.clear(task._id);
  };

  complete = async (task: T, result: unknown): Promise<void> => {
    task.status = TaskStatus.Complete;
    task.result = result;
    await this.cache.set(task._id, task);
    await this.cache.clear(task._id);
  };

  progress = async (task: T, progress: IProgress): Promise<void> => {
    task.progress = progress;
    await this.cache.set(task._id, task);
  };
}
