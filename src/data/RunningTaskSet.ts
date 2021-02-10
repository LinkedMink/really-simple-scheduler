import { IAgingCache } from "@linkedmink/multilevel-aging-cache";
import { EventEmitter } from "events"
import { Types } from "mongoose";
import { Logger } from "../infastructure/Logger";
import { ITask, TaskStatus } from "../models/database/Task";


export class RunningTaskSet<T extends ITask> extends EventEmitter {
  private readonly logger = Logger.get(RunningTaskSet.name);

  constructor(
    private readonly runningCache: IAgingCache<Types.ObjectId, T>
  ) {
    super()
  }

  start(task: T): void {
    if (task.state !== TaskStatus.Scheduled && task.state !== TaskStatus.Suspended) {
      this.logger.warn(`Task is not in a state that can be started: ${task.id}`);
      return;
    }
  }

  cancel(task: T): void {
    if (task.state !== TaskStatus.Running) {
      this.logger.warn(`Task is not in a state that can be canceled: ${task.id}`);
      return;
    }
  }
}
