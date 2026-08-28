import { TenantStatus } from "../../../domain/tenant/TenantStatus";

export interface TenantResponse {
  id: string;
  name: string;
  status: TenantStatus;
  createdAt: string;
}
