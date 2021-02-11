import { NextFunction, Request, RequestHandler } from "express";
import { Socket } from "socket.io";

export class SocketIoError<T = unknown> extends Error {
  constructor(public data?: T) {
    super();
  }
}

export enum SocketIoEvent {
  Connection = "connection",
  Disconnect = "disconnect",
  Disconnecting = "disconnecting",
}

export enum SocketIoDisconnectReason {
  ServerInitiated = "io server disconnect",
  ClientInitiated = "io client disconnect",
  PingTimeout = "ping timeout",
  ConnectionClosed = "transport close",
  ConnectionError = "transport error",
}

export type ConnectHandler = (socket: Socket) => void;
export type DisconnectHandler = (reason: SocketIoDisconnectReason) => void;

export type MiddlewareNextFunc = (err?: SocketIoError) => void;
export type MiddlewareHandler = (socket: Socket, next: MiddlewareNextFunc) => void;

export const wrapRequestHandler = (handler: RequestHandler): MiddlewareHandler => {
  return (socket: Socket, next: MiddlewareNextFunc) => {
    const resAdapter = {
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      status: () => {},
      send: (data: unknown) => next(new SocketIoError(data)),
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return handler(socket.request as Request, resAdapter as any, next as NextFunction);
  };
};
