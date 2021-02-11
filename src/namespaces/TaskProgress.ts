import { basename } from "path";
import { Server as IoServer, Socket } from "socket.io";
import { TaskProgressController } from "../controllers/TaskProgressController";
import { TaskEventDispatch } from "../data/TaskEvents";
import { TaskTypeData } from "../data/TaskTypeData";
import { SocketIoEvent, wrapRequestHandler } from "../infastructure/Socket";
import { authorizeJwtClaim } from "../middleware/Authorization";
import { corsMiddleware } from "../middleware/Cors";

export enum TaskProgrssEvent {
  Cancel = "cancel",
  Watch = "watch",
  Reported = "reported",
  Suspended = "suspended",
  Faulted = "faulted",
  Completed = "completed",
}

export const registerTaskProgress = (
  io: IoServer,
  taskInfo: TaskTypeData,
  taskDispatch: TaskEventDispatch
): void => {
  taskInfo.types.forEach(type => {
    const namespace = io.of(`/task/progress/${type.name}`);
    const auth = wrapRequestHandler(authorizeJwtClaim([type.name + "Manage"]));
    namespace.use(auth);
    namespace.use(wrapRequestHandler(corsMiddleware));

    namespace.on(SocketIoEvent.Connection, (socket: Socket) => {
      const controller = new TaskProgressController(socket, taskInfo, taskDispatch);

      socket.on(TaskProgrssEvent.Cancel, controller.cancelHandler);

      socket.on(TaskProgrssEvent.Watch, controller.watchHandler);
    });
  });
};
