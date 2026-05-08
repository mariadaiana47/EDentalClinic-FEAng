export interface Radiologist {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  clinicName?: string;
  clinicAddress?: string;
}

export interface AffiliatedRadiologistRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  clinicName?: string;
  clinicAddress?: string;
}
