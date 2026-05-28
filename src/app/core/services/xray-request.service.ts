import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from './base-api';
import { API_ROUTES } from '../constants/api-routes';
import { XrayRequest, CreateXrayRequest } from '../models/xray.model';

@Injectable({ providedIn: 'root' })
export class XrayRequestService extends BaseApi {
  constructor(http: HttpClient) {
    super(http);
  }

  create(req: CreateXrayRequest): Observable<XrayRequest> {
    return this.http.post<XrayRequest>(API_ROUTES.XRAY_REQUESTS.BASE, req);
  }

  myRequests(): Observable<XrayRequest[]> {
    return this.http.get<XrayRequest[]>(API_ROUTES.XRAY_REQUESTS.MY);
  }

  byId(id: number): Observable<XrayRequest> {
    return this.http.get<XrayRequest>(API_ROUTES.XRAY_REQUESTS.BY_ID(id));
  }

  selectRadiologist(requestId: number, radiologistId: number, scheduledAt?: string): Observable<XrayRequest> {
    return this.http.post<XrayRequest>(
      API_ROUTES.XRAY_REQUESTS.SELECT_RADIOLOGIST(requestId),
      { radiologistId, scheduledAt },
    );
  }
}
