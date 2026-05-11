import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from './base-api';
import { API_ROUTES } from '../constants/api-routes';
import { Patient, PatientRegistrationRequest, PatientSearchCriteria } from '../models/patient.model';

@Injectable({ providedIn: 'root' })
export class PatientService extends BaseApi {
  register(req: PatientRegistrationRequest): Observable<{ message: string; temporaryPassword?: string }> {
    return this.http.post<{ message: string; temporaryPassword?: string }>(
      API_ROUTES.PATIENTS.REGISTER, req,
    );
  }

  search(criteria: PatientSearchCriteria): Observable<Patient[]> {
    return this.http.get<Patient[]>(API_ROUTES.PATIENTS.SEARCH, { params: { ...criteria } as any });
  }

  list(): Observable<Patient[]> {
    return this.http.get<Patient[]>(API_ROUTES.PATIENTS.BASE);
  }

  byId(id: number): Observable<Patient> {
    return this.http.get<Patient>(API_ROUTES.PATIENTS.BY_ID(id));
  }

  getDentalRecord(id: number): Observable<any> {
    return this.http.get<any>(`${API_ROUTES.PATIENTS.BY_ID(id)}/dental-record`);
  }

  me(): Observable<Patient> {
    return this.http.get<Patient>(API_ROUTES.PATIENTS.ME);
  }
}
