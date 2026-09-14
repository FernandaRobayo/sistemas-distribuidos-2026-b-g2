import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CustomerApiService } from '../../core/customer-api.service';
import { CURRENT_TENANT_ID } from '../../core/tenant.constants';
import { getPasswordPolicyError } from '../../core/password-policy';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent {
  private readonly customerApi = inject(CustomerApiService);
  private readonly router = inject(Router);

  passwordVisible = signal(false);
  confirmVisible = signal(false);
  feedback = signal('');
  feedbackIsError = signal(false);
  submitting = signal(false);

  // Solo presentacion: identifica que campo corresponde al mensaje de "feedback" ya
  // existente, para resaltarlo junto al campo ademas de mostrarlo abajo del formulario.
  // No agrega ninguna validacion nueva; reutiliza exactamente las mismas condiciones.
  invalidField = signal<'first_name' | 'last_name' | 'email' | 'password' | 'confirm_password' | null>(null);

  // BUG corregido: cada campo llamaba a invalidField.set(null) sin condicion, asi que
  // editar CUALQUIER campo ocultaba el error de OTRO campo distinto (ej. escribir en
  // "Apellido" borraba visualmente el error ya mostrado en "Correo electronico"). Ahora
  // cada campo solo limpia el error si es el campo que efectivamente lo tiene.
  clearFieldError(field: 'first_name' | 'last_name' | 'email' | 'password' | 'confirm_password'): void {
    if (this.invalidField() === field) {
      this.invalidField.set(null);
    }
  }

  togglePasswordVisibility(): void {
    this.passwordVisible.set(!this.passwordVisible());
  }

  toggleConfirmVisibility(): void {
    this.confirmVisible.set(!this.confirmVisible());
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    const form = event.currentTarget as HTMLFormElement;
    const data = new FormData(form);
    const firstName = String(data.get('first_name') || '').trim();
    const lastName = String(data.get('last_name') || '').trim();
    const email = String(data.get('email') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    const password = String(data.get('password') || '');
    const passwordConfirmation = String(data.get('confirm_password') || '');

    if (!firstName || !lastName || !email || !password || !passwordConfirmation) {
      // Mismo gate de siempre (al menos un campo obligatorio vacio); solo se anade cual
      // de ellos, en orden, es el primero vacio para resaltarlo junto al campo.
      if (!firstName) this.setFieldError('first_name', 'Ingresa tu nombre.');
      else if (!lastName) this.setFieldError('last_name', 'Ingresa tu apellido.');
      else if (!email) this.setFieldError('email', 'Ingresa tu correo electrónico.');
      else if (!password) this.setFieldError('password', 'Ingresa una contraseña.');
      else this.setFieldError('confirm_password', 'Confirma tu contraseña.');
      return;
    }
    const policyError = getPasswordPolicyError(password);
    if (policyError) {
      this.setFieldError('password', policyError);
      return;
    }
    if (password !== passwordConfirmation) {
      this.setFieldError('confirm_password', 'La contraseña y su confirmación deben coincidir.');
      return;
    }

    this.invalidField.set(null);
    this.submitting.set(true);
    this.setFeedback('Creando tu cuenta...', false);

    this.customerApi
      .register(CURRENT_TENANT_ID, { firstName, lastName, email, phone, password, passwordConfirmation })
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.invalidField.set(null);
          this.setFeedback('Cuenta creada. Ya puedes iniciar sesión.', false);
          window.setTimeout(() => this.router.navigateByUrl('/login'), 1500);
        },
        error: (error: HttpErrorResponse) => {
          this.submitting.set(false);
          if (error.status === 409) this.invalidField.set('email');
          this.setFeedback(this.mapRegisterError(error), true);
        },
      });
  }

  private mapRegisterError(error: HttpErrorResponse): string {
    if (error.status === 409) {
      return 'Ya existe una cuenta registrada con ese correo.';
    }
    if (error.status === 400) {
      return error.error?.message || 'Revisa los datos ingresados.';
    }
    if (error.status === 0) {
      return 'No se pudo conectar con el servidor. Intenta de nuevo.';
    }
    return 'No fue posible crear la cuenta. Intenta de nuevo mas tarde.';
  }

  private setFeedback(message: string, isError: boolean): void {
    this.feedback.set(message);
    this.feedbackIsError.set(isError);
  }

  private static readonly FIELD_INPUT_ID: Record<'first_name' | 'last_name' | 'email' | 'password' | 'confirm_password', string> = {
    first_name: 'signup-first-name',
    last_name: 'signup-last-name',
    email: 'signup-email',
    password: 'signup-password',
    confirm_password: 'signup-confirm',
  };

  private setFieldError(field: 'first_name' | 'last_name' | 'email' | 'password' | 'confirm_password', message: string): void {
    this.invalidField.set(field);
    this.setFeedback(message, true);
    // Mueve el foco al campo senalado: el error se anuncia de inmediato via
    // aria-describedby sin depender de que el usuario tabule manualmente hasta el.
    document.getElementById(SignupComponent.FIELD_INPUT_ID[field])?.focus();
  }
}
