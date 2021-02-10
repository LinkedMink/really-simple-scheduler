import { EventEmitter } from "events"

export enum TaskEvent {
  Scheduled = 'scheduled',
  Started = 'started',
  Suspended = 'suspended',
  Failed = 'Failed',
  Canceled = 'canceled',
  Completed = 'completed'
}

export class TaskEventEmitter extends EventEmitter {
  addListenersForTaskType(): void {

  }
}

export const taskEventExchange = new TaskEventEmitter();
