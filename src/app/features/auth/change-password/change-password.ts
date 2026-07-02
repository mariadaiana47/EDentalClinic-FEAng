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
        <div class="cp-brand">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#2aa8bf" width="28" height="28">
            <path d="M19 3c-1.3 0-2.5.5-3.4 1.4C14.7 3.5 13.4 3 12 3s-2.7.5-3.6 1.4C7.5 3.5 6.3 3 5 3 3.3 3 2 4.3 2 6c0 1.5.9 2.8 2.2 3.2L5.5 20c.2.6.7 1 1.3 1 .5 0 1-.3 1.2-.8L9.5 16l1.5 4.2c.2.5.7.8 1.2.8h.6c.5 0 1-.3 1.2-.8L15.5 16l1.5 4.2c.2.5.7.8 1.2.8.6 0 1.1-.4 1.3-1l1.3-10.8C21.1 8.8 22 7.5 22 6c0-1.7-1.3-3-3-3z"/>
          </svg>
          <span>EDentalClinic</span>
        </div>
        <p class="cp-sub">Schimbați parola temporară pentru a continua</p>

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
            <span *ngIf="loading()" class="d-flex align-items-center justify-content-center gap-2">
              <span class="spinner-border spinner-border-sm"></span> Se salveaza...
            </span>
          </button>
        </form>
      </div>
    </div>
  `,
  styles: [`
    .cp-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #f4f6f8;
      padding: 1rem;
    }
    .cp-card {
      width: 100%;
      max-width: 400px;
      background: #ffffff;
      border: 1px solid #e2e6ea;
      border-radius: 6px;
      padding: 2.5rem 2.5rem 2rem;
      box-shadow: 0 2px 12px rgba(0,0,0,0.07);
    }
    .cp-brand {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.55rem;
      font-size: 1.45rem;
      font-weight: 700;
      color: #1a2b3c;
      letter-spacing: -0.02em;
      margin-bottom: 0.35rem;
    }
    .cp-sub {
      color: #6b7a8d;
      font-size: 0.875rem;
      margin-bottom: 2rem;
      text-align: center;
    }
    .field-group { display: flex; flex-direction: column; margin-bottom: 1.1rem; }
    .field-group label { font-size: 0.8rem; font-weight: 600; color: #374151; margin-bottom: 0.35rem; }
    .field-group input {
      display: block; width: 100%;
      background: #ffffff;
      border: 1px solid #d1d5db;
      border-radius: 4px;
      color: #1a2b3c;
      font-size: 0.9rem;
      padding: 0.65rem 0.875rem;
      outline: none;
      transition: border-color 0.15s, box-shadow 0.15s;
      box-sizing: border-box;
    }
    .field-group input::placeholder { color: #b0b8c4; }
    .field-group input:focus { border-color: #2aa8bf; box-shadow: 0 0 0 3px rgba(42,168,191,0.12); }
    .error-msg {
      background: #fef2f2;
      border: 1px solid #fecaca;
      color: #b91c1c;
      font-size: 0.85rem;
      padding: 0.6rem 0.875rem;
      border-radius: 4px;
      margin-bottom: 1.1rem;
    }
    .cp-btn {
      display: block; width: 100%;
      background: #2aa8bf;
      border: none;
      border-radius: 4px;
      color: #fff;
      font-weight: 600;
      font-size: 0.9rem;
      padding: 0.75rem;
      cursor: pointer;
      margin-top: 0.75rem;
      transition: background 0.15s;
    }
    .cp-btn:hover:not(:disabled) { background: #2496ab; }
    .cp-btn:disabled { background: #a8d8e0; cursor: not-allowed; }
    @media (max-width: 480px) {
      .cp-card { padding: 2rem 1.5rem 1.75rem; }
      .cp-brand { font-size: 1.25rem; }
    }
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
