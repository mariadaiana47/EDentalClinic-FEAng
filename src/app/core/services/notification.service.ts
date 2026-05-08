import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from './base-api';
import { API_ROUTES } from '../constants/api-routes';
import { AppNotification } from '../models/notification.model';

@Injectable({ providedIn: 'root' })
export class NotificationApiService extends BaseApi {
  myNotifications(): Observable<AppNotification[]> {
    return this.http.get<AppNotification[]>(API_ROUTES.NOTIFICATIONS.MY);
  }
  markRead(id: number): Observable<AppNotification> {
    return this.http.post<AppNotification>(API_ROUTES.NOTIFICATIONS.MARK_READ(id), {});
  }
}
