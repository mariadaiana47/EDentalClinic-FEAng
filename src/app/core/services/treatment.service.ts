import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from './base-api';
import { API_ROUTES } from '../constants/api-routes';
import { Treatment } from '../models/treatment.model';

@Injectable({ providedIn: 'root' })
export class TreatmentService extends BaseApi {
  /** UC X — Gestionare tratament: salvare/upsert. */
  save(recordId: number, treatment: Partial<Treatment>): Observable<Treatment> {
    return this.http.post<Treatment>(API_ROUTES.TREATMENTS.BY_RECORD(recordId), treatment);
  }

  byRecord(recordId: number): Observable<Treatment[]> {
    return this.http.get<Treatment[]>(API_ROUTES.TREATMENTS.BY_RECORD(recordId));
  }
}
