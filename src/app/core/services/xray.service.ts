import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ROUTES } from '../constants/api-routes';

export interface XRayRequest {
  id?: number;
  teethInvolved: string;
  type: string;
  details?: string;
  status?: string;
  createdAt?: string;
  xray?: { id?: number };
}

@Injectable({ providedIn: 'root' })
export class XRayService {
  constructor(private http: HttpClient) {}

  create(patientId: number, request: XRayRequest): Observable<XRayRequest> {
    return this.http.post<XRayRequest>(`${API_ROUTES.XRAY_REQUESTS.BASE}/patient/${patientId}`, request);
  }

  getByPatient(patientId: number): Observable<XRayRequest[]> {
    return this.http.get<XRayRequest[]>(`${API_ROUTES.XRAY_REQUESTS.BASE}/patient/${patientId}`);
  }

  getImageUrl(xrayId: number): string {
    return `${API_ROUTES.XRAYS.BASE}/${xrayId}/image`;
  }
}
