import { environment } from '../../../environments/environment';

const API = environment.apiUrl;

export const API_ROUTES = {
  AUTH: {
    LOGIN: `${API}/auth/login`,
    REGISTER: `${API}/auth/register`,
    CHANGE_PASSWORD: `${API}/auth/change-password`,
  },
  PATIENTS: {
    BASE: `${API}/patients`,
    ME: `${API}/patients/me`,
    REGISTER: `${API}/patients/register`,
    SEARCH: `${API}/patients/search`,
    BY_ID: (id: number | string) => `${API}/patients/${id}`,
  },
  DOCTORS: {
    BASE: `${API}/doctors`,
    ME: `${API}/doctors/me`,
    BY_ID: (id: number | string) => `${API}/doctors/${id}`,
    AFFILIATED_RADIOLOGISTS: `${API}/doctors/me/radiologists`,
    AFFILIATED_RADIOLOGIST_BY_ID: (id: number | string) => `${API}/doctors/me/radiologists/${id}`,
  },
  RADIOLOGISTS: {
    BASE: `${API}/radiologists`,
    BY_ID: (id: number | string) => `${API}/radiologists/${id}`,
  },
  DENTAL_RECORDS: {
    BASE: `${API}/dental-records`,
    BY_PATIENT: (patientId: number | string) => `${API}/dental-records/patient/${patientId}`,
    INFO: (recordId: number | string) => `${API}/dental-records/${recordId}/info`,
    INFO_BY_ID: (recordId: number | string, infoId: number | string) =>
      `${API}/dental-records/${recordId}/info/${infoId}`,
    CLINICAL_EXAM: (recordId: number | string) => `${API}/dental-records/${recordId}/clinical-exam`,
  },
  XRAY_REQUESTS: {
    BASE: `${API}/xray-requests`,
    MY: `${API}/xray-requests/me`,
    BY_ID: (id: number | string) => `${API}/xray-requests/${id}`,
    SELECT_RADIOLOGIST: (id: number | string) => `${API}/xray-requests/${id}/select-radiologist`,
  },
  XRAYS: {
    BASE: `${API}/xrays`,
    UPLOAD: (requestId: number | string) => `${API}/xrays/upload/${requestId}`,
    DOWNLOAD: (id: number | string) => `${API}/xrays/${id}/download`,
    MARK_VIEWED: (id: number | string) => `${API}/xrays/${id}/mark-viewed`,
  },
  TREATMENTS: {
    BASE: `${API}/treatments`,
    BY_RECORD: (recordId: number | string) => `${API}/treatments/record/${recordId}`,
    BY_ID: (id: number | string) => `${API}/treatments/${id}`,
  },
  NOTIFICATIONS: {
    BASE: `${API}/notifications`,
    MY: `${API}/notifications/me`,
    MARK_READ: (id: number | string) => `${API}/notifications/${id}/read`,
  },
  CLINICAL_EXAMS: {
    BASE: (patientId: number | string) => `${API}/patients/${patientId}/clinical-exam`,
  },
} as const;
