import bodyParser from "body-parser";
import express from "express";
import expressWs from "express-ws";
import passport from "passport";

import { config } from "./infastructure/Config";
import { ConfigKey } from "./infastructure/ConfigKey";
import { connectSingletonDatabase } from "./infastructure/Database";
import { initializeLogger, Logger } from "./infastructure/Logger";
import { corsMiddleware } from "./middleware/Cors";
import { errorMiddleware } from "./middleware/Error";
import { logRequestMiddleware } from "./middleware/LogRequest";
import { addJwtStrategy } from "./middleware/Passport";
import { pingRouter } from "./routes/PingRouter";
import { getSwaggerRouter } from "./routes/SwaggerRouter";

initializeLogger();
void connectSingletonDatabase();

const app = express();
expressWs(app);

app.use(logRequestMiddleware());
app.use(bodyParser.json());

addJwtStrategy(passport);
app.use(passport.initialize());

app.use(corsMiddleware);
app.use(errorMiddleware);

app.use("/", pingRouter);

void getSwaggerRouter()
  .then(router => {
    app.use("/docs", router);
    Logger.get().info("Swagger Doc Loaded: /docs")
  })
  .catch(error => {
    Logger.get().info("Swagger Disabled")
    Logger.get().verbose(error)
  });

const listenPort = config.getNumber(ConfigKey.ListenPort);
export const server = app.listen(listenPort);
