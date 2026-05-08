import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ROUTES } from '../constants/api-routes';

export interface Treatment {
  id?: number;
  description: string;
  teethInvolved?: string;
  cost?: number;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class TreatmentService {
  private http = inject(HttpClient);

  add(patientId: number, treatment: Treatment): Observable<Treatment> {
    return this.http.post<Treatment>(`${API_ROUTES.TREATMENTS.BASE}/patient/${patientId}`, treatment);
  }

  getByPatient(patientId: number): Observable<Treatment[]> {
    return this.http.get<Treatment[]>(`${API_ROUTES.TREATMENTS.BASE}/patient/${patientId}`);
  }
}
