import { TenantStatus } from "../../../domain/tenant/TenantStatus";

export interface CreateTenantRequest {
  name: string;
  status?: TenantStatus;
}
