import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { OperatorRoleService } from '../operator-role.service';
import { SessionService } from '../../../core/session.service';
import { TenantApiService } from '../../../core/tenant-api.service';

@Component({
  selector: 'app-operator-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './operator-shell.component.html',
  styleUrl: './operator-shell.component.css',
})
export class OperatorShellComponent implements OnInit {
  readonly roleService = inject(OperatorRoleService);
  private readonly sessionService = inject(SessionService);
  private readonly tenantApi = inject(TenantApiService);

  // Fuente real: TenantController (GET /api/tenants/{tenantId}), mismo endpoint ya usado
  // por Platform Admin para listar/editar operadores. Antes se mostraba el placeholder
  // literal "[Tu Marca]"; mientras la peticion resuelve (o si falla) se muestra un estado
  // neutro ('') en vez de un nombre inventado.
  tenantName = signal('');

  ngOnInit(): void {
    const tenantId = this.sessionService.tenantId();
    if (!tenantId) return;
    this.tenantApi.getById(tenantId).subscribe({
      next: (tenant) => this.tenantName.set(tenant.commercialName),
      error: () => this.tenantName.set(''),
    });
  }

  // BUG corregido: "Cerrar sesión" solo navegaba a /login sin invalidar la sesión real
  // (SessionService.clear()); el JWT seguia vigente en sessionStorage. Unica logica de
  // limpieza real vive en SessionService.clear() (fuente unica); este metodo solo la invoca.
  logout(): void {
    this.sessionService.clear();
  }
}
