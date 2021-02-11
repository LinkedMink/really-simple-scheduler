import { AgingCacheWriteStatus, IAgingCache } from "@linkedmink/multilevel-aging-cache";
import { Types } from "mongoose";
import { ITask, TaskStatus } from "../models/database/Task";

export class TaskQueue<T extends ITask> {
  constructor(private readonly cache: IAgingCache<Types.ObjectId, T>) {}

  peek = this.cache.peek.bind(this.cache);

  enqueue = async (task: T): Promise<boolean> => {
    const saved = await this.cache.set(task._id, task);
    return saved.status === AgingCacheWriteStatus.Success;
  };

  dequeue = async (id: string): Promise<T | null> => {
    const next = await this.cache.peek();
    if (next?.id === id) {
      await this.cache.clear(next._id);
      return next;
    }
    return null;
  };
}
