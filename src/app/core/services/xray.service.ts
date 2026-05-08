import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from './base-api';
import { API_ROUTES } from '../constants/api-routes';
import { Xray, XrayType } from '../models/xray.model';

@Injectable({ providedIn: 'root' })
export class XrayService extends BaseApi {
  /** UC VIII — Radiologul incarca radiografia ca multipart/form-data. */
  upload(requestId: number, file: File, type: XrayType, observations?: string): Observable<Xray> {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('type', type);
    if (observations) fd.append('observations', observations);
    return this.http.post<Xray>(API_ROUTES.XRAYS.UPLOAD(requestId), fd);
  }

  /** URL pentru afisare/descarcare radiografie. */
  downloadUrl(id: number): string {
    return API_ROUTES.XRAYS.DOWNLOAD(id);
  }

  /** UC IX — Marchez radiografia ca vizualizata de medic. */
  markViewed(id: number): Observable<Xray> {
    return this.http.post<Xray>(API_ROUTES.XRAYS.MARK_VIEWED(id), {});
  }
}
