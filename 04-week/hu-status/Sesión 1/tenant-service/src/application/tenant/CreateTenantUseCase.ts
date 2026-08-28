import { Tenant } from "../../domain/tenant/Tenant";
import { CreateTenantUseCasePort } from "../../domain/tenant/ports/in/CreateTenantUseCasePort";
import { TenantRepositoryPort } from "../../domain/tenant/ports/out/TenantRepositoryPort";
import { CreateTenantRequest } from "./dtos/CreateTenantRequest";
import { TenantResponse } from "./dtos/TenantResponse";

export class CreateTenantUseCase implements CreateTenantUseCasePort {
  constructor(private readonly tenantRepository: TenantRepositoryPort) {}

  async execute(request: CreateTenantRequest): Promise<TenantResponse> {
    const tenant = Tenant.create(request.name, request.status ?? "ACTIVE");

    await this.tenantRepository.save(tenant);

    return {
      id: tenant.id,
      name: tenant.name,
      status: tenant.status,
      createdAt: tenant.createdAt.toISOString(),
    };
  }
}
