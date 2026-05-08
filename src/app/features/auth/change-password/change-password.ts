import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../../core/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-container">
      <div class="auth-card">
        <h2>Schimbare Parolă Obligatorie</h2>
        <p>Trebuie să vă schimbați parola temporară înainte de a continua.</p>

        <form (submit)="onSubmit()" class="auth-form">
          <div *ngIf="error()" class="alert alert-error">{{ error() }}</div>
          
          <div class="form-group">
            <label>Parola Curentă</label>
            <input type="password" [(ngModel)]="currentPassword" name="curr" required>
          </div>
          
          <div class="form-group">
            <label>Parola Nouă</label>
            <input type="password" [(ngModel)]="newPassword" name="new" required>
          </div>
          
          <div class="form-group">
            <label>Confirmă Parola Nouă</label>
            <input type="password" [(ngModel)]="confirmPassword" name="conf" required>
          </div>

          <button type="submit" class="btn-primary" [disabled]="loading()">
            {{ loading() ? 'Se salvează...' : 'Schimbă Parola' }}
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .auth-container { height: 100vh; display: flex; align-items: center; justify-content: center; background: #f8fafc; }
    .auth-card { background: white; padding: 2.5rem; border-radius: 1rem; box-shadow: 0 10px 25px rgba(0,0,0,0.05); width: 100%; max-width: 400px; }
    h2 { margin-bottom: 0.5rem; color: #1e293b; }
    p { color: #64748b; margin-bottom: 2rem; font-size: 0.875rem; }
    .form-group { margin-bottom: 1.25rem; }
    label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #475569; font-size: 0.875rem; }
    input { width: 100%; padding: 0.75rem; border: 1px solid #cbd5e1; border-radius: 0.5rem; }
    .btn-primary { width: 100%; padding: 0.75rem; background: #3b82f6; color: white; border: none; border-radius: 0.5rem; font-weight: 600; cursor: pointer; margin-top: 1rem; }
    .alert-error { background: #fef2f2; color: #991b1b; padding: 0.75rem; border-radius: 0.5rem; margin-bottom: 1rem; font-size: 0.875rem; }
  `]
})
export class ChangePassword {
  private auth = inject(Auth);
  private router = inject(Router);

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  
  loading = signal(false);
  error = signal<string | null>(null);

  onSubmit() {
    if (this.newPassword !== this.confirmPassword) {
      this.error.set('Parolele noi nu coincid.');
      return;
    }

    this.loading.set(true);
    this.auth.changePassword({
      currentPassword: this.currentPassword,
      newPassword: this.newPassword,
      confirmNewPassword: this.confirmPassword
    }).subscribe({
      next: () => {
        this.loading.set(false);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.loading.set(false);
        this.error.set(err.error?.message || 'Eroare la schimbarea parolei.');
      }
    });
  }
}
