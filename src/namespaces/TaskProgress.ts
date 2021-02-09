import { basename } from "path";
import { Server as IoServer, Socket } from "socket.io";
import { TaskProgressController } from "../controllers/TaskProgressController";
import { SocketIoEvent, wrapRequestHandler } from "../infastructure/Socket";
import { corsMiddleware } from "../middleware/Cors";

export enum TaskProgrssEvent {
  Cancel = 'cancel',
  Watch = 'watch',
  Reported = 'reported',
  Suspended = 'suspended',
  Faulted = 'faulted',
  Completed = 'completed',
}

export const setTaskProgressNamespace = (io: IoServer): void => {
  const scope = basename(__filename)

  const namespace = io.of("/task/progress");
  namespace.use(wrapRequestHandler(corsMiddleware));

  io.on(SocketIoEvent.Connection, (socket: Socket) => {
    const controller = new TaskProgressController(socket);

    socket.on(`${scope}:${TaskProgrssEvent.Cancel}`, controller.cancelHandler)
  })
};
