import { Tenant } from "../../../../domain/tenant/Tenant";
import { TenantRepositoryPort } from "../../../../domain/tenant/ports/out/TenantRepositoryPort";
import { TenantStatus } from "../../../../domain/tenant/TenantStatus";

type TenantRow = {
  id: string;
  name: string;
  status: TenantStatus;
  created_at: Date;
};

export class PostgresTenantRepository implements TenantRepositoryPort {
  constructor(private readonly pool: any) {}

  async init(): Promise<void> {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS tenants (
        id UUID PRIMARY KEY,
        name VARCHAR(120) NOT NULL,
        status VARCHAR(20) NOT NULL,
        created_at TIMESTAMPTZ NOT NULL
      )
    `);
  }

  async save(tenant: Tenant): Promise<void> {
    await this.pool.query(
      `INSERT INTO tenants (id, name, status, created_at)
       VALUES ($1, $2, $3, $4)`,
      [tenant.id, tenant.name, tenant.status, tenant.createdAt],
    );
  }

  async findById(id: string): Promise<Tenant | null> {
    const result = await this.pool.query(
      `SELECT id, name, status, created_at
       FROM tenants
       WHERE id = $1`,
      [id],
    );

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0] as TenantRow;

    return Tenant.rehydrate(row.id, row.name, row.status, new Date(row.created_at));
  }
}
