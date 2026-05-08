import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from './base-api';
import { API_ROUTES } from '../constants/api-routes';
import { Radiologist } from '../models/radiologist.model';

@Injectable({ providedIn: 'root' })
export class RadiologistService extends BaseApi {
  list(): Observable<Radiologist[]> {
    return this.http.get<Radiologist[]>(API_ROUTES.RADIOLOGISTS.BASE);
  }
  byId(id: number): Observable<Radiologist> {
    return this.http.get<Radiologist>(API_ROUTES.RADIOLOGISTS.BY_ID(id));
  }
}
