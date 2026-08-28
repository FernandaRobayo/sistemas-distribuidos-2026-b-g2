import { CreateTenantRequest } from "../../../../application/tenant/dtos/CreateTenantRequest";
import { TenantResponse } from "../../../../application/tenant/dtos/TenantResponse";

export interface CreateTenantUseCasePort {
  execute(request: CreateTenantRequest): Promise<TenantResponse>;
}
