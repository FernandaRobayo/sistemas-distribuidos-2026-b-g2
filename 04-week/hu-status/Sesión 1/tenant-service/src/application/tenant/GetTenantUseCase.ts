import { GetTenantUseCasePort } from "../../domain/tenant/ports/in/GetTenantUseCasePort";
import { TenantRepositoryPort } from "../../domain/tenant/ports/out/TenantRepositoryPort";
import { TenantResponse } from "./dtos/TenantResponse";

export class GetTenantUseCase implements GetTenantUseCasePort {
  constructor(private readonly tenantRepository: TenantRepositoryPort) {}

  async execute(id: string): Promise<TenantResponse | null> {
    const tenant = await this.tenantRepository.findById(id);

    if (!tenant) {
      return null;
    }

    return {
      id: tenant.id,
      name: tenant.name,
      status: tenant.status,
      createdAt: tenant.createdAt.toISOString(),
    };
  }
}
