import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_ROUTES } from '../constants/api-routes';

export interface ClinicalExamRequest {
  dentalChart: string;
  teethExamination: string;
  mucosaExamination: string;
  ridges?: string;
  tuberosities?: string;
  palatalVault?: string;
  otherElements?: string;
  diseaseHistory?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ClinicalExamService {
  private http = inject(HttpClient);

  save(patientId: number, request: ClinicalExamRequest): Observable<any> {
    return this.http.post(API_ROUTES.CLINICAL_EXAMS.BASE(patientId), request);
  }

  getByPatientId(patientId: number): Observable<any> {
    return this.http.get(API_ROUTES.CLINICAL_EXAMS.BASE(patientId));
  }
}
