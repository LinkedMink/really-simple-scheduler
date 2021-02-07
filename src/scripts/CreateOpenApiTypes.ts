#!/usr/bin/env node

import fs from "fs";
import { OpenAPIV3 } from "openapi-types";
import yaml from "yaml";
import { TaskType } from "../models/database";
import { initializeLogger, Logger } from "../infastructure/Logger";
import { connectSingletonDatabase } from "../infastructure/Database";

const TASK_TYPE_DOC = "./docs/TaskTypeParamsResults.yaml";

initializeLogger();
const logger = Logger.get();

const main = async () => {
  logger.info("Generating TaskType OpenAPI Def");

  await connectSingletonDatabase();
  const taskTypes = await TaskType.find({}).exec();

  logger.info(`Loaded TaskType: ${taskTypes.length}`);

  const doc = {
    components: {
      schemas: {} as Record<string, OpenAPIV3.SchemaObject>,
    },
  };

  taskTypes.forEach(t => {
    if (t.parameterSchema) {
      doc.components.schemas[t.name + "Parameters"] = t.parameterSchema;
    }

    if (t.resultSchema) {
      doc.components.schemas[t.name + "Results"] = t.resultSchema;
    }
  });

  await fs.promises.writeFile(TASK_TYPE_DOC, yaml.stringify(doc));

  logger.info(`Success! OpenAPI TaskType Written: ${TASK_TYPE_DOC}`);
};

void main()
  .then(() => process.exit(0))
  .catch(e => {
    logger.error({ message: e as Error });
    process.exit(1);
  });
