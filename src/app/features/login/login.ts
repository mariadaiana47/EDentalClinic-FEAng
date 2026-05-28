import { Component, signal } from '@angular/core';
import { Auth } from '../../core/auth';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { Role } from '../../core/models/auth-response.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class Login {
  email = '';
  password = '';

  constructor(private authService: Auth, private router: Router) {}

  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  onSubmit() {
    this.errorMessage.set(null);
    if (!this.email || !this.password) {
      this.errorMessage.set('Va rugam completati toate campurile corect.');
      return;
    }

    this.loading.set(true);
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.temporaryPassword) {
          this.router.navigate(['/change-password']);
          return;
        }
        this.router.navigate([this.dashboardRouteFor(res.role)]);
      },
      error: (err: HttpErrorResponse) => {
        this.loading.set(false);
        this.errorMessage.set(this.mapError(err));
      },
    });
  }

  private dashboardRouteFor(role: string): string {
    const r = role.replace('ROLE_', '') as Role;
    switch (r) {
      case 'DOCTOR': return '/doctor';
      case 'PATIENT': return '/patient';
      case 'ASSISTANT': return '/assistant';
      case 'RADIOLOGIST': return '/radiologist';
      default: return '/login';
    }
  }

  private mapError(err: HttpErrorResponse): string {
    if (err.status === 0) return 'Server-ul nu raspunde. Verifica daca backend-ul Spring Boot ruleaza pe portul 8081.';
    if (err.status === 400) return 'Date invalide. Verifica email-ul si parola.';
    if (err.status === 401 || err.status === 403) return 'Email sau parola incorecta.';
    if (typeof err.error === 'string' && err.error.length < 200) return err.error;
    if (err.error?.message) return err.error.message;
    return 'A aparut o eroare la autentificare. Incearca din nou.';
  }
}
