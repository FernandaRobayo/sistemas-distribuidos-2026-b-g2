import { Component, computed, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';

// BLOQUEO conocido (ver design-system.md / navigation-map.md): no existe backend de
// recuperacion de contrasena (sin servicio, sin endpoint en 07-api/contracts/openapi).
// Este componente ya no simula un flujo de codigo + nueva contrasena que no puede
// completarse: informa desde el inicio, en lenguaje de usuario, que la recuperacion
// automatica todavia no esta disponible, y ofrece volver a iniciar sesion. No se muestra
// un canal de soporte porque no hay ninguno real documentado.
@Component({
  selector: 'app-recover',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './recover.component.html',
  styleUrl: './recover.component.css',
})
export class RecoverComponent {
  private readonly route = inject(ActivatedRoute);

  // Preserva la intencion "equipo del operador" si se llego desde Login con ?as=staff,
  // para volver exactamente a la misma pestana visual (mismo mecanismo ya usado por
  // Home -> Login: un query param de ayuda, sin contrato nuevo).
  private readonly cameFromStaff = this.route.snapshot.queryParamMap.get('as') === 'staff';
  loginQueryParams = computed(() => (this.cameFromStaff ? { as: 'staff' } : {}));
}
