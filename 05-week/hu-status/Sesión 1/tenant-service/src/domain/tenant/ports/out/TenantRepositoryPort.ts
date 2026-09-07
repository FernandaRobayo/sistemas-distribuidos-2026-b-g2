import { Tenant } from "../../Tenant";

export interface TenantRepositoryPort {
  init(): Promise<void>;
  save(tenant: Tenant): Promise<void>;
  findById(id: string): Promise<Tenant | null>;
}
