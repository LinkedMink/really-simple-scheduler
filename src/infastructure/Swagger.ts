import fs from "fs";
import swaggerJsDoc from "swagger-jsdoc";
import { JsonObject } from "swagger-ui-express";

import { config } from "../infastructure/Config";

export const DEFAULT_SWAGGER_DOC_FILE = "swagger.json";

export const generateSwaggerDoc = (): JsonObject => {
  const swaggerJsDocOptions: swaggerJsDoc.Options = {
    definition: {
      openapi: "3.0.3",
      info: {
        title: config.packageJson.name,
        version: config.packageJson.version,
        description: config.packageJson.description,
      },
    },
    apis: ["./docs/**/*.yaml", "./src/models/**/*.ts", "./src/routes/**/*.ts"],
  };

  return swaggerJsDoc(swaggerJsDocOptions);
};

export const loadSwaggerDocFile = async (filename = DEFAULT_SWAGGER_DOC_FILE): Promise<JsonObject> => {
  const data = await fs.promises.readFile(filename, "utf8");
  const swaggerSpec = JSON.parse(data) as JsonObject;
  return swaggerSpec;
};
