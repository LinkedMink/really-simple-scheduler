#!/usr/bin/env node

import bodyParser from "body-parser";
import express from "express";
import expressWs from "express-ws";
import passport from "passport";

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
import { TaskInfoCache } from "./data/TaskInfoCache";

initializeLogger();
void connectSingletonDatabase();

const app = express();
expressWs(app);

app.use(logRequestMiddleware());
app.use(bodyParser.json());

addJwtStrategy(passport);
app.use(passport.initialize());

app.use(corsMiddleware);

app.use("/", pingRouter);
app.use("/task-type", taskTypeRouter);

void TaskInfoCache.get().then(cache => {
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

const listenPort = config.getNumber(ConfigKey.ListenPort);
export const server = app.listen(listenPort);
