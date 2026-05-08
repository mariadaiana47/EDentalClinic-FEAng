import { Role } from './auth-response.model';

export interface UserInfo {
  id: number;
  email: string;
  role: Role;
  temporaryPassword: boolean;
}
