import { CreateTenantUseCase } from "../../application/tenant/CreateTenantUseCase";
import { GetTenantUseCase } from "../../application/tenant/GetTenantUseCase";
import { TenantController } from "../adapters/in/http/TenantController";
import { PostgresTenantRepository } from "../adapters/out/persistence/PostgresTenantRepository";
import { pool } from "./database";

export const createContainer = async (): Promise<TenantController> => {
  const tenantRepository = new PostgresTenantRepository(pool);
  await tenantRepository.init();

  const createTenantUseCase = new CreateTenantUseCase(tenantRepository);
  const getTenantUseCase = new GetTenantUseCase(tenantRepository);

  return new TenantController(createTenantUseCase, getTenantUseCase);
};
