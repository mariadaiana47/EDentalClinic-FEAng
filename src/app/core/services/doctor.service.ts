import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from './base-api';
import { API_ROUTES } from '../constants/api-routes';
import { Doctor } from '../models/doctor.model';
import { Radiologist, AffiliatedRadiologistRequest } from '../models/radiologist.model';

@Injectable({ providedIn: 'root' })
export class DoctorService extends BaseApi {
  list(): Observable<Doctor[]> {
    return this.http.get<Doctor[]>(API_ROUTES.DOCTORS.BASE);
  }

  byId(id: number): Observable<Doctor> {
    return this.http.get<Doctor>(API_ROUTES.DOCTORS.BY_ID(id));
  }

  me(): Observable<Doctor> {
    return this.http.get<Doctor>(API_ROUTES.DOCTORS.ME);
  }

  listAffiliatedRadiologists(): Observable<Radiologist[]> {
    return this.http.get<Radiologist[]>(API_ROUTES.DOCTORS.AFFILIATED_RADIOLOGISTS);
  }

  addAffiliatedRadiologist(req: AffiliatedRadiologistRequest): Observable<Radiologist> {
    return this.http.post<Radiologist>(API_ROUTES.DOCTORS.AFFILIATED_RADIOLOGISTS, req);
  }

  removeAffiliatedRadiologist(id: number): Observable<void> {
    return this.http.delete<void>(API_ROUTES.DOCTORS.AFFILIATED_RADIOLOGIST_BY_ID(id));
  }
}
