import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from './base-api';
import { API_ROUTES } from '../constants/api-routes';
import { Patient, PatientRegistrationRequest, PatientSearchCriteria } from '../models/patient.model';

@Injectable({ providedIn: 'root' })
export class PatientService extends BaseApi {
  constructor(http: HttpClient) {
    super(http);
  }

  register(req: PatientRegistrationRequest): Observable<string> {
    return this.http.post(API_ROUTES.PATIENTS.REGISTER, req, { responseType: 'text' });
  }

  search(criteria: PatientSearchCriteria): Observable<Patient[]> {
    return this.http.get<Patient[]>(API_ROUTES.PATIENTS.SEARCH, { params: { ...criteria } as any });
  }

  list(mine: boolean = false): Observable<Patient[]> {
    return this.http.get<Patient[]>(API_ROUTES.PATIENTS.BASE, { params: { mine: mine.toString() } });
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
