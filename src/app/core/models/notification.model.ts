export type NotificationType =
  | 'XRAY_REQUEST_RECEIVED'
  | 'XRAY_UPLOADED'
  | 'NEW_PATIENT_CREDENTIALS'
  | 'PASSWORD_CHANGED'
  | 'APPOINTMENT_SCHEDULED'
  | 'GENERIC';

export interface AppNotification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}
