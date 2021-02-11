import { Socket } from "socket.io";
import { TaskEventDispatch } from "../data/TaskEvents";
import { TaskTypeData } from "../data/TaskTypeData";
import { Logger } from "../infastructure/Logger";

export class TaskProgressController {
  private readonly logger = Logger.get(TaskProgressController.name);

  constructor(
    private readonly socket: Socket,
    private readonly taskInfo: TaskTypeData,
    private readonly taskDispatch: TaskEventDispatch
  ) {}

  cancelHandler = (taskId: string): void => {
    return;
  };

  watchHandler = (taskId: string): void => {
    return;
  };
}
