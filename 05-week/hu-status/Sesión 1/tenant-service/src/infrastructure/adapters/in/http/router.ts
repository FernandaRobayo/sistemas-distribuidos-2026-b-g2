import { Router } from "express";
import { TenantController } from "./TenantController";

export const createRouter = (tenantController: TenantController): Router => {
  const router = Router();

  router.get("/health", (request, response) => tenantController.health(request, response));
  router.post("/tenants", tenantController.createTenant);
  router.get("/tenants/:id", tenantController.getTenantById);

  return router;
};
