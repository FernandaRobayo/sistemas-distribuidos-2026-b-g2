import { Request, Response } from "express";
import { CreateTenantUseCasePort } from "../../../../domain/tenant/ports/in/CreateTenantUseCasePort";
import { GetTenantUseCasePort } from "../../../../domain/tenant/ports/in/GetTenantUseCasePort";

export class TenantController {
  constructor(
    private readonly createTenantUseCase: CreateTenantUseCasePort,
    private readonly getTenantUseCase: GetTenantUseCasePort,
  ) {}

  health(_request: Request, response: Response): void {
    response.status(200).json({
      status: "ok",
      service: "tenant-service",
      date: new Date().toISOString(),
    });
  }

  createTenant = async (request: Request, response: Response): Promise<void> => {
    try {
      const tenant = await this.createTenantUseCase.execute(request.body);
      response.status(201).json(tenant);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unexpected error";
      response.status(400).json({ message });
    }
  };

  getTenantById = async (request: Request, response: Response): Promise<void> => {
    const tenantId = Array.isArray(request.params.id) ? request.params.id[0] : request.params.id;
    const tenant = await this.getTenantUseCase.execute(tenantId);

    if (!tenant) {
      response.status(404).json({ message: "Tenant not found" });
      return;
    }

    response.status(200).json(tenant);
  };
}
