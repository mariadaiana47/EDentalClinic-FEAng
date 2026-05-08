import { Gender } from './common.model';

export interface Patient {
  id: number;
  firstName: string;
  lastName: string;
  cnp: string;
  email: string;
  phone: string;
  age?: number;
  gender: Gender;
  birthDate: string; // ISO yyyy-MM-dd
  generalHealthStatus?: string;
  previousTreatments?: string;
}

export interface PatientRegistrationRequest {
  firstName: string;
  lastName: string;
  cnp: string;
  email: string;
  phone: string;
  age?: number;
  gender: Gender;
  birthDate: string;
  generalHealthStatus?: string;
  previousTreatments?: string;
}

export interface PatientSearchCriteria {
  cnp?: string;
  name?: string;
}
