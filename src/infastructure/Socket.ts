import { NextFunction, Request, RequestHandler } from "express";
import { Socket } from "socket.io";

export interface ISocketIoError<T = unknown> extends Error {
  data?: T;
}

export enum SocketIoEvent {
  Connection = 'connection',
  Disconnect = 'disconnect',
  Disconnecting = 'disconnecting',
}

export enum SocketIoDisconnectReason {
  ServerInitiated = 'io server disconnect',
  ClientInitiated = 'io client disconnect',
  PingTimeout = 'ping timeout',
  ConnectionClosed = 'transport close',
  ConnectionError = 'transport error',
}

export type ConnectHandler = (socket: Socket) => void;
export type DisconnectHandler = (reason: SocketIoDisconnectReason) => void;

export type MiddlewareNextFunc = (err?: ISocketIoError) => void;
export type MiddlewareHandler = (socket: Socket, next: MiddlewareNextFunc) => void;

export const wrapRequestHandler = (handler: RequestHandler): MiddlewareHandler => {
  return (socket: Socket, next: MiddlewareNextFunc) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handler(socket.request as Request, {} as any, next as NextFunction);
}
