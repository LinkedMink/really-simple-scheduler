import { Router } from "express";
import { config } from "../infastructure/Config";
import {
  generateSwaggerDoc,
  loadSwaggerDocFile,
} from "../infastructure/Swagger";

export const getSwaggerRouter = async (): Promise<Router> => {
  const swaggerUi = await import("swagger-ui-express")

  const swaggerDoc = config.isEnvironmentLocal 
    ? generateSwaggerDoc()
    : await loadSwaggerDocFile()
  
  // Type=SwaggerUiOptions if package doesn't exist, we can't import it
  const swaggerUiOptions: Record<string, unknown> = {
    isExplorer: true,
  };
  
  const swaggerRouter = Router();
  swaggerRouter.use("/", swaggerUi.serve);
  swaggerRouter.get("/", swaggerUi.setup(swaggerDoc, swaggerUiOptions))

  return swaggerRouter;  
}
