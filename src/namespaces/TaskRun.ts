import { basename } from "path";
import { Server as IoServer, Socket } from "socket.io";
import { TaskRunController } from "../controllers/TaskRunController";
import { SocketIoEvent } from "../infastructure/Socket";

export enum TaskRunEvent {
  Initiate = "initiate",
  ReportProgress = 'reportProgress',
}

export const setTaskRunNamespace = (io: IoServer): void => {
  const scope = basename(__filename)

  const namespace = io.of("/task/run");

  io.on(SocketIoEvent.Connection, (socket: Socket) => {
    const controller = new TaskRunController(socket);

    socket.on(`${scope}:${TaskRunEvent.Initiate}`, controller.initiateHandler)

    socket.on(`${scope}:${TaskRunEvent.ReportProgress}`, controller.reportProgressHandler)
  })
};
