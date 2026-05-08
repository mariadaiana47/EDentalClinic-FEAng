export type Role = 'DOCTOR' | 'PATIENT' | 'ASSISTANT' | 'RADIOLOGIST';

export interface AuthResponse {
  token: string;
  role: Role;
  temporaryPassword: boolean;
  temporaryPasswordValue: string | null;
}
