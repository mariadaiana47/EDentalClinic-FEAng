import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Auth } from '../../../core/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="cp-page">
      <div class="cp-card">
        <div class="cp-icon"><i class="bi bi-shield-lock-fill"></i></div>
        <h2 class="cp-title">Schimbare Parola</h2>
        <p class="cp-sub">Trebuie sa va schimbati parola temporara inainte de a continua.</p>

        <form (submit)="onSubmit()">
          <div *ngIf="error()" class="error-msg">{{ error() }}</div>

          <div class="field-group">
            <label>Parola Curenta</label>
            <input type="password" [(ngModel)]="currentPassword" name="curr" required placeholder="••••••••">
          </div>
          <div class="field-group">
            <label>Parola Noua</label>
            <input type="password" [(ngModel)]="newPassword" name="new" required placeholder="••••••••">
          </div>
          <div class="field-group">
            <label>Confirma Parola Noua</label>
            <input type="password" [(ngModel)]="confirmPassword" name="conf" required placeholder="••••••••">
          </div>

          <button type="submit" class="cp-btn" [disabled]="loading()">
            <span *ngIf="!loading()">Schimba Parola</span>
            <span *ngIf="loading()">
              <span class="spinner-border spinner-border-sm me-2"></span>Se salveaza...
            </span>
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .cp-page {
      min-height: 100vh; display: flex; align-items: center; justify-content: center;
      background: linear-gradient(160deg, #051828 0%, #0d3d56 60%, #051828 100%);
      padding: 1rem;
    }
    .cp-card {
      width: 100%; max-width: 400px;
      background: rgba(255,255,255,0.08);
      border: 1px solid rgba(255,255,255,0.15);
      border-radius: 0;
      padding: 2.75rem 2.5rem 2.25rem;
    }
    .cp-icon { font-size: 2.5rem; color: #3cbdd4; margin-bottom: 0.5rem; }
    .cp-title { font-size: 1.5rem; font-weight: 700; color: #fff; margin-bottom: 0.25rem; }
    .cp-sub { color: rgba(255,255,255,0.5); font-size: 0.875rem; margin-bottom: 1.75rem; }
    .field-group { display: flex; flex-direction: column; margin-bottom: 1.1rem; }
    .field-group label { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; color: rgba(255,255,255,0.55); margin-bottom: 0.35rem; }
    .field-group input {
      display: block; width: 100%; background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,255,255,0.18); border-radius: 0;
      color: #fff; font-size: 0.95rem; padding: 0.7rem 1rem; outline: none;
      transition: border-color 0.2s;
    }
    .field-group input:focus { border-color: #3cbdd4; background: rgba(60,189,212,0.08); }
    .field-group input::placeholder { color: rgba(255,255,255,0.25); }
    .error-msg {
      background: rgba(239,68,68,0.15); border: 1px solid rgba(239,68,68,0.35);
      color: #fca5a5; font-size: 0.85rem; padding: 0.65rem 0.875rem; margin-bottom: 1.25rem;
    }
    .cp-btn {
      display: block; width: 100%; background: #3cbdd4; border: none; border-radius: 0;
      color: #fff; font-weight: 700; font-size: 0.95rem; letter-spacing: 0.04em;
      padding: 0.85rem; cursor: pointer; margin-top: 0.5rem; transition: background 0.2s;
    }
    .cp-btn:hover:not(:disabled) { background: #2aa8bf; }
    .cp-btn:disabled { background: rgba(60,189,212,0.45); cursor: not-allowed; }
  `]
})
export class ChangePassword {
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  constructor(private auth: Auth, private router: Router) {}

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
