import { basename } from "path";
import { Server as IoServer, Socket } from "socket.io";
import { TaskRunController } from "../controllers/TaskRunController";
import { TaskEventDispatch } from "../data/TaskEvents";
import { TaskTypeData } from "../data/TaskTypeData";
import { SocketIoEvent, wrapRequestHandler } from "../infastructure/Socket";
import { authorizeJwtClaim } from "../middleware/Authorization";

export enum TaskRunEvent {
  Initiate = "initiate",
  ReportProgress = "reportProgress",
}

export enum TaskRunOutboundEvent {
  Canceled = "canceled",
  TaskPeeked = 'taskPeeked'
}

export const registerTaskRun = (
  io: IoServer,
  taskInfo: TaskTypeData,
  taskDispatch: TaskEventDispatch
): void => {
  taskInfo.types.forEach(type => {
    const namespace = io.of(`/task/run/${type.name}`);
    const auth = wrapRequestHandler(authorizeJwtClaim([type.name + "Manage"]));
    namespace.use(auth);

    namespace.on(SocketIoEvent.Connection, (socket: Socket) => {
      const controller = new TaskRunController(socket, taskInfo, taskDispatch);

      socket.on(TaskRunEvent.Initiate, controller.initiateHandler);

      socket.on(TaskRunEvent.ReportProgress, controller.reportProgressHandler);
    });
  });
};
