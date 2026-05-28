import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from './base-api';
import { API_ROUTES } from '../constants/api-routes';
import { Radiologist } from '../models/radiologist.model';

@Injectable({ providedIn: 'root' })
export class RadiologistService extends BaseApi {
  constructor(http: HttpClient) {
    super(http);
  }

  list(): Observable<Radiologist[]> {
    return this.http.get<Radiologist[]>(API_ROUTES.RADIOLOGISTS.BASE);
  }
  byId(id: number): Observable<Radiologist> {
    return this.http.get<Radiologist>(API_ROUTES.RADIOLOGISTS.BY_ID(id));
  }
}
