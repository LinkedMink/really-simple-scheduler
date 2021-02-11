import { Socket } from "socket.io";
import { TaskEventDispatch } from "../data/TaskEvents";
import { TaskTypeData } from "../data/TaskTypeData";
import { Logger } from "../infastructure/Logger";
import { TaskStatus } from "../models/database/Task";
import { IProgressModel } from "../models/responses/IProgressModel";

export class TaskRunController {
  private readonly logger = Logger.get(TaskRunController.name);

  constructor(
    private readonly socket: Socket,
    private readonly taskInfo: TaskTypeData,
    private readonly taskDispatch: TaskEventDispatch
  ) {}

  initiateHandler = (taskId: string): void => {
    // if (task.state !== TaskStatus.Scheduled && task.state !== TaskStatus.Suspended) {
    //   this.logger.warn(`Task is not in a state that can be started: ${task.id}`);
    //   return;
    // }

    // const dequeued = taskStatus === TaskStatus.Suspended
    //     ? data.suspendedQueue.dequeue(taskId)
    //     : data.scheduledQueue.dequeue(taskId)
    return;
  };

  reportProgressHandler = (progress: IProgressModel): void => {
    return;
  };
}
