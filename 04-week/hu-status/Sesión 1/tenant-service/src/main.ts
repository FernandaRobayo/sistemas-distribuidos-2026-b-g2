import dotenv from "dotenv";
import express from "express";
import { createContainer } from "./infrastructure/config/container";
import { createRouter } from "./infrastructure/adapters/in/http/router";

dotenv.config();

const start = async (): Promise<void> => {
  const app = express();
  const tenantController = await createContainer();
  const port = Number(process.env.PORT ?? 3001);

  app.use(express.json());
  app.use(createRouter(tenantController));

  app.listen(port, () => {
    console.log(`tenant-service running on http://localhost:${port}`);
  });
};

start().catch((error) => {
  console.error("Error starting tenant-service", error);
  process.exit(1);
});
