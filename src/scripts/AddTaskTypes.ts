#!/usr/bin/env node

import fs from "fs";
import yaml from "yaml";
import { connectSingletonDatabase } from "../infastructure/Database";

import { initializeLogger, Logger } from "../infastructure/Logger";
import { ITaskType, TaskType } from "../models/database/TaskType";

interface ITaskTypeYaml {
  TaskTypes: ITaskType[];
}

initializeLogger();
const logger = Logger.get();

const saveTaskType = (taskType: ITaskType) =>
  new Promise((resolve, reject) => {
    new TaskType(taskType).save((error, doc) => {
      if (error) {
        logger.error({ message: error });
        logger.warn(`Failed to Save: ${taskType.name}`);
        resolve(null);
      }

      logger.info(`Saved: ${taskType.name}`);
      resolve(doc);
    });
  });

const main = async () => {
  if (process.argv.length !== 3) {
    logger.error("Usage: node AddTaskTypes.js [Task Type yaml File]");
    process.exit(1);
  }
  const yamlFile = process.argv[2];
  logger.info(`Reading File: ${yamlFile}`);

  const connect = connectSingletonDatabase();
  const read = fs.promises.readFile(yamlFile).then(d => yaml.parse(d.toString()) as ITaskTypeYaml);

  const waited = await Promise.all([connect, read]);
  const yamlData = waited[1];
  logger.info("Read Valid File");

  const savedData = await Promise.all(yamlData.TaskTypes.map(saveTaskType));
  const savedTotal = savedData.filter(d => d !== null).length;
  if (savedTotal === savedData.length) {
    logger.info(`Success! Saved ${savedTotal} records`);
  } else {
    logger.warn(`Some records failed to save: ${savedTotal}/${savedData.length} Saved`);
  }
};

main()
  .then(() => process.exit(0))
  .catch(e => {
    logger.error({ message: e as Error });
    process.exit(1);
  });
