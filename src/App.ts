#!/usr/bin/env node

import bodyParser from "body-parser";
import express from "express";
import { createServer } from "http";
import passport from "passport";
import { Server as IoServer } from "socket.io";

import { config } from "./infastructure/Config";
import { ConfigKey } from "./infastructure/ConfigKey";
import { connectSingletonDatabase } from "./infastructure/Database";
import { initializeLogger, Logger } from "./infastructure/Logger";
import { corsMiddleware } from "./middleware/Cors";
import { getErrorMiddleware } from "./middleware/Error";
import { logRequestMiddleware } from "./middleware/LogRequest";
import { addJwtStrategy } from "./middleware/Passport";
import { getOpenApiRouter } from "./routes/OpenApiRouter";
import { pingRouter } from "./routes/PingRouter";
import { getTaskScheduleRouter } from "./routes/TaskScheduleRouter";
import { getTaskQueueRouter } from "./routes/TaskQueueRouter";
import { taskTypeRouter } from "./routes/TaskTypeRouter";
import { TaskTypeData } from "./data/TaskTypeData";
import { wrapRequestHandler } from "./infastructure/Socket";
import { authenticateJwt } from "./middleware/Authorization";
import { setTaskProgressNamespace } from "./namespaces/TaskProgress";
import { setTaskRunNamespace } from "./namespaces/TaskRun";

initializeLogger();
void connectSingletonDatabase();

const app = express();
const httpServer = createServer(app);

app.use(logRequestMiddleware());
app.use(bodyParser.json());

addJwtStrategy(passport);
const passportHandler = passport.initialize();
app.use(passportHandler);

app.use(corsMiddleware);

app.use("/", pingRouter);
app.use("/task-type", taskTypeRouter);

void TaskTypeData.get().then(cache => {
  app.use("/task/queue", getTaskQueueRouter(cache));
  app.use("/task/schedule", getTaskScheduleRouter(cache));

  app.use(getErrorMiddleware());

  void getOpenApiRouter()
    .then(router => {
      app.use("/docs", router);
      Logger.get().info("Swagger UI Path: /docs");
    })
    .catch(error => {
      Logger.get().info("Swagger Disabled");
      Logger.get().verbose({ message: error as Error });
    });
});

const io = new IoServer(httpServer);
io.use(wrapRequestHandler(passportHandler));
io.use(wrapRequestHandler(authenticateJwt));
setTaskRunNamespace(io)
setTaskProgressNamespace(io);

const listenPort = config.getNumber(ConfigKey.ListenPort);
httpServer.listen(listenPort);
