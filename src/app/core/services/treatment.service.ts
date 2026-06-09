import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Treatment, TreatmentPhase, TreatmentPlan, ProtheticWork } from '../models/treatment.model';

const API = environment.apiUrl;

export type { Treatment, TreatmentPhase, TreatmentPlan, ProtheticWork };

@Injectable({ providedIn: 'root' })
export class TreatmentService {
  constructor(private http: HttpClient) {}

  // ── Treatment ─────────────────────────────────────────────────────────────

  add(patientId: number, treatment: Partial<Treatment>): Observable<Treatment> {
    return this.http.post<Treatment>(`${API}/treatments/patient/${patientId}`, treatment);
  }

  getByPatient(patientId: number): Observable<Treatment[]> {
    return this.http.get<Treatment[]>(`${API}/treatments/patient/${patientId}`);
  }

  getById(treatmentId: number): Observable<Treatment> {
    return this.http.get<Treatment>(`${API}/treatments/${treatmentId}`);
  }

  // ── Treatment Plan ────────────────────────────────────────────────────────

  savePlan(patientId: number, plan: Partial<TreatmentPlan>): Observable<TreatmentPlan> {
    return this.http.post<TreatmentPlan>(`${API}/treatments/plan/patient/${patientId}`, plan);
  }

  getPlan(patientId: number): Observable<TreatmentPlan | null> {
    return this.http.get<TreatmentPlan>(`${API}/treatments/plan/patient/${patientId}`);
  }

  // ── Treatment Phases ──────────────────────────────────────────────────────

  addPhase(treatmentId: number, phase: Partial<TreatmentPhase>): Observable<TreatmentPhase> {
    return this.http.post<TreatmentPhase>(`${API}/treatments/${treatmentId}/phases`, phase);
  }

  getPhases(treatmentId: number): Observable<TreatmentPhase[]> {
    return this.http.get<TreatmentPhase[]>(`${API}/treatments/${treatmentId}/phases`);
  }

  deletePhase(phaseId: number): Observable<void> {
    return this.http.delete<void>(`${API}/treatments/phases/${phaseId}`);
  }

  // ── Prothetic Works ───────────────────────────────────────────────────────

  addProtheticWork(treatmentId: number, work: Partial<ProtheticWork>): Observable<ProtheticWork> {
    return this.http.post<ProtheticWork>(`${API}/treatments/${treatmentId}/prothetics`, work);
  }

  getProtheticWorks(treatmentId: number): Observable<ProtheticWork[]> {
    return this.http.get<ProtheticWork[]>(`${API}/treatments/${treatmentId}/prothetics`);
  }

  deleteProtheticWork(workId: number): Observable<void> {
    return this.http.delete<void>(`${API}/treatments/prothetics/${workId}`);
  }
}
