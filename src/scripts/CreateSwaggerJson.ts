import fs from "fs";

import { initializeLogger, Logger } from "../infastructure/Logger";
import {
  generateSwaggerDoc,
  DEFAULT_SWAGGER_DOC_FILE,
} from "../infastructure/Swagger";

initializeLogger();
const logger = Logger.get();

logger.info("Generate Swagger Doc - Start");

const docObject = generateSwaggerDoc();
const docData = JSON.stringify(docObject, undefined, 2);
fs.writeFileSync(DEFAULT_SWAGGER_DOC_FILE, docData);

logger.info("Generate Swagger Doc - End");
