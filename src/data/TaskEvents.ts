/* eslint-disable @typescript-eslint/no-misused-promises */
import { EventEmitter } from "events";
import { ITask } from "../models/database/Task";
import { ITaskDataStructures } from "./DataStructureFactory";

export enum TaskEvent {
  Scheduled = "scheduled",
  Started = "started",
  Suspended = "suspended",
  Failed = "Failed",
  Canceled = "canceled",
  Completed = "completed",
  Progressed = "progressed",
}

export class TaskEventDispatch extends EventEmitter {
  dispatch = (event: TaskEvent, task: ITask, ...args: unknown[]): boolean => {
    return this.emit(`${task.taskTypeName}:${event}`, task, args);
  };

  register = <T extends ITask>(type: string, data: ITaskDataStructures<T>): void => {
    this.addListener(`${type}:${TaskEvent.Scheduled}`, data.scheduledQueue.enqueue);
    this.addListener(`${type}:${TaskEvent.Started}`, data.runningSet.start);
    this.addListener(`${type}:${TaskEvent.Suspended}`, data.suspendedQueue.enqueue);
    this.addListener(`${type}:${TaskEvent.Failed}`, data.runningSet.fault);
    this.addListener(`${type}:${TaskEvent.Canceled}`, data.runningSet.cancel);
    this.addListener(`${type}:${TaskEvent.Completed}`, data.runningSet.complete);
    this.addListener(`${type}:${TaskEvent.Progressed}`, data.runningSet.progress);
  };
}
