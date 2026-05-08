import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponse } from './models/auth-response.model';

export type Role = 'DOCTOR' | 'PATIENT' | 'ASSISTANT' | 'RADIOLOGIST';

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

const TOKEN_KEY = 'edc_token';
const ROLE_KEY = 'edc_role';
const EMAIL_KEY = 'edc_email';
const TEMP_PWD_KEY = 'edc_temp_pwd';

@Injectable({
  providedIn: 'root',
})
export class Auth {
  private http = inject(HttpClient);
  private api = `${environment.apiUrl}/auth`;

  // signals reactive pentru a observa starea sesiunii in componente
  readonly currentRole = signal<Role | null>(this.readRole());
  readonly currentEmail = signal<string | null>(localStorage.getItem(EMAIL_KEY));
  readonly mustChangePassword = signal<boolean>(localStorage.getItem(TEMP_PWD_KEY) === 'true');

  /**
   * Trimite { email, password } catre Spring Boot — corespunde LoginDTO.java.
   * Persisteaza token-ul, rolul si flag-ul de parola temporara.
   */
  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.api}/login`, { email, password }).pipe(
      tap((res) => this.persistSession(email, res)),
    );
  }

  changePassword(req: ChangePasswordRequest): Observable<string> {
    return this.http
      .post(`${this.api}/change-password`, req, { responseType: 'text' })
      .pipe(
        tap(() => {
          localStorage.setItem(TEMP_PWD_KEY, 'false');
          this.mustChangePassword.set(false);
        }),
      );
  }

  logout(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ROLE_KEY);
    localStorage.removeItem(EMAIL_KEY);
    localStorage.removeItem(TEMP_PWD_KEY);
    // chei vechi din versiuni anterioare
    localStorage.removeItem('token');
    this.currentRole.set(null);
    this.currentEmail.set(null);
    this.mustChangePassword.set(false);
  }

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  hasRole(role: Role): boolean {
    return this.currentRole() === role;
  }

  private persistSession(email: string, res: AuthResponse): void {
    const normalizedRole = res.role.replace('ROLE_', '') as Role;
    localStorage.setItem(TOKEN_KEY, res.token);
    localStorage.setItem(ROLE_KEY, normalizedRole);
    localStorage.setItem(EMAIL_KEY, email);
    localStorage.setItem(TEMP_PWD_KEY, String(res.temporaryPassword));
    this.currentRole.set(normalizedRole);
    this.currentEmail.set(email);
    this.mustChangePassword.set(res.temporaryPassword);
  }

  private readRole(): Role | null {
    const r = localStorage.getItem(ROLE_KEY)?.replace('ROLE_', '');
    if (!r) return null;
    const validRoles: Role[] = ['DOCTOR', 'PATIENT', 'ASSISTANT', 'RADIOLOGIST'];
    return validRoles.includes(r as Role) ? (r as Role) : null;
  }
}
