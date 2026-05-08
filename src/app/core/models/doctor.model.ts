export interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  specialization?: string;
  clinic?: string;
}
