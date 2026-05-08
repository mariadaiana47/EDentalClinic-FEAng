import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApi } from './base-api';
import { API_ROUTES } from '../constants/api-routes';
import { DentalRecord, RecordInfo, RecordInfoType } from '../models/dental-record.model';
import { ClinicalExam } from '../models/clinical-exam.model';

export interface RecordInfoCreate {
  type: RecordInfoType;
  content: string;
}

@Injectable({ providedIn: 'root' })
export class DentalRecordService extends BaseApi {
  /** Dosar complet pentru un pacient. */
  byPatient(patientId: number): Observable<DentalRecord> {
    return this.http.get<DentalRecord>(API_ROUTES.DENTAL_RECORDS.BY_PATIENT(patientId));
  }

  /** UC IV — Adaugare examen clinic. */
  saveClinicalExam(recordId: number, exam: ClinicalExam): Observable<ClinicalExam> {
    return this.http.put<ClinicalExam>(API_ROUTES.DENTAL_RECORDS.CLINICAL_EXAM(recordId), exam);
  }

  /** UC XII — Adaugare informatii dosar. */
  addInfo(recordId: number, info: RecordInfoCreate): Observable<RecordInfo> {
    return this.http.post<RecordInfo>(API_ROUTES.DENTAL_RECORDS.INFO(recordId), info);
  }

  /** UC XIII — Modificare informatii dosar. */
  updateInfo(recordId: number, infoId: number, content: string): Observable<RecordInfo> {
    return this.http.put<RecordInfo>(API_ROUTES.DENTAL_RECORDS.INFO_BY_ID(recordId, infoId), { content });
  }

  /** UC XIV — Stergere informatii dosar. */
  deleteInfo(recordId: number, infoId: number): Observable<void> {
    return this.http.delete<void>(API_ROUTES.DENTAL_RECORDS.INFO_BY_ID(recordId, infoId));
  }
}
