import { NextFunction, Request, RequestHandler, Response } from "express";
import path from "path";
import { Socket } from "socket.io";
import { Logger } from "../infastructure/Logger";
import { MiddlewareHandler, MiddlewareNextFunc } from "../infastructure/Socket";

export const logRequestMiddleware = (): RequestHandler => {
  const logger = Logger.get(path.basename(__filename));

  return (req: Request, res: Response, next: NextFunction): void => {
    const start = Date.now();
    logger.http(`Start ${req.method} ${req.originalUrl}`);

    next();

    const elapsed = Date.now() - start;
    logger.http(`Ended ${req.method} ${req.originalUrl} ${res.statusCode} ${elapsed} ms`);
  };
};

export const logSocketMiddleware = (): MiddlewareHandler => {
  const logger = Logger.get(path.basename(__filename));

  return (socket: Socket, next: MiddlewareNextFunc): void => {
    logger.http(`Socket Connected: ${socket.request.url}`);

    next();
  };
};
