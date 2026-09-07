import { TenantResponse } from "../../../../application/tenant/dtos/TenantResponse";

export interface GetTenantUseCasePort {
  execute(id: string): Promise<TenantResponse | null>;
}
