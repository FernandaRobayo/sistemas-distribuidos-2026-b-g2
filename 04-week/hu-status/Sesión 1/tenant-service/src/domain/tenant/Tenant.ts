import { randomUUID } from "crypto";
import { TenantStatus } from "./TenantStatus";

export class Tenant {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly status: TenantStatus,
    public readonly createdAt: Date,
  ) {}

  static create(name: string, status: TenantStatus = "ACTIVE"): Tenant {
    const normalizedName = name.trim();

    if (!normalizedName) {
      throw new Error("Tenant name is required");
    }

    return new Tenant(randomUUID(), normalizedName, status, new Date());
  }

  static rehydrate(
    id: string,
    name: string,
    status: TenantStatus,
    createdAt: Date,
  ): Tenant {
    return new Tenant(id, name, status, createdAt);
  }
}
