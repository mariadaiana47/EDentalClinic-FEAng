import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../../core/services/patient.service';
import { XRayService, XRayRequest } from '../../../core/services/xray.service';
import { TreatmentService } from '../../../core/services/treatment.service';
import { ClinicalExamService } from '../../../core/services/clinical-exam.service';
import { API_ROUTES } from '../../../core/constants/api-routes';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="patient-container" *ngIf="patient(); else loading">
      <div class="welcome-banner">
        <h1>Bună, {{ patient().firstName }}! 👋</h1>
        <p>Acesta este dosarul tău medical digital.</p>
      </div>

      <div class="dashboard-layout">
        <!-- Medical Summary -->
        <div class="sidebar">
          <div class="card info">
            <h3>Date Personale</h3>
            <p><strong>CNP:</strong> {{ patient().cnp }}</p>
            <p><strong>Vârstă:</strong> {{ patient().age }} ani</p>
            <p><strong>Telefon:</strong> {{ patient().phone }}</p>
          </div>

          <div class="card status">
            <h3>Status Sănătate</h3>
            <p><strong>General:</strong> {{ dentalRecord()?.generalHealthStatus || 'Nu sunt date.' }}</p>
            <p><strong>Antecedente:</strong> {{ dentalRecord()?.previousTreatments || 'Nu sunt date.' }}</p>
          </div>
        </div>

        <!-- Main Records -->
        <div class="main-content">
          
          <!-- X-Ray Requests & Selection -->
          <div class="card section">
            <h3>📷 Cererile Mele de Radiografie</h3>
            <div class="xray-list">
              <div *ngFor="let x of xrayRequests()" class="xray-box">
                <div class="x-header">
                  <span class="type">{{ x.type }} - Dinți: {{ x.teethInvolved }}</span>
                  <span class="status" [class.done]="x.status === 'COMPLETED'">{{ x.status }}</span>
                </div>

                <!-- Scheduling Section -->
                <div *ngIf="x.status === 'PENDING' && !x.selectedRadiologist" class="scheduling">
                  <p class="instr">Vă rugăm să alegeți un radiolog pentru această investigație:</p>
                  <div class="radiologist-selector">
                    <select [(ngModel)]="selectedRadId">
                      <option [value]="null">Selectați Radiologul</option>
                      <option *ngFor="let r of affiliatedRadiologists()" [value]="r.id">
                        {{ r.firstName }} {{ r.lastName }} - {{ r.email }}
                      </option>
                    </select>
                    <input type="datetime-local" [(ngModel)]="appointmentDate">
                    <button class="btn-schedule" (click)="confirmScheduling(x.id!)" [disabled]="!selectedRadId || !appointmentDate">
                      Confirmă Programarea
                    </button>
                  </div>
                </div>

                <div *ngIf="x.selectedRadiologist && x.status === 'PENDING'" class="scheduled-info">
                   📅 Programat la <strong>{{ x.selectedRadiologist.firstName }} {{ x.selectedRadiologist.lastName }}</strong> 
                   pe data de <strong>{{ x.appointmentTime | date:'short' }}</strong>
                </div>

                <!-- View Result if Done -->
                <div *ngIf="x.status === 'COMPLETED'" class="result-view">
                   <button class="btn-view" (click)="toggleImage(x.id!)">👁️ Vezi Radiografia</button>
                   <div *ngIf="viewingId() === x.id" class="img-preview">
                      <img [src]="getImageUrl(x.xray?.id)" alt="Radiografie">
                   </div>
                </div>
              </div>
              <div *ngIf="xrayRequests().length === 0" class="empty">Nu aveți cereri active.</div>
            </div>
          </div>

          <!-- Clinical Exams -->
          <div class="card section">
            <h3>🦷 Examen Clinic</h3>
            <div *ngIf="clinicalExam(); else noExam" class="exam-data">
              <p><strong>Observații medic:</strong> {{ clinicalExam().teethExamination }}</p>
              <p><strong>Dinți vizați:</strong> {{ clinicalExam().dentalChart }}</p>
            </div>
            <ng-template #noExam><p class="empty">Niciun examen clinic înregistrat.</p></ng-template>
          </div>

          <!-- Treatments -->
          <div class="card section">
            <h3>🛠️ Tratamente Efectuate</h3>
            <div class="treatment-table">
              <div *ngFor="let t of treatments()" class="t-row">
                <span>{{ t.description }}</span>
                <span class="price">{{ t.cost }} RON</span>
              </div>
              <div *ngIf="treatments().length === 0" class="empty">Niciun tratament înregistrat.</div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <ng-template #loading><div class="loading">Se încarcă dosarul...</div></ng-template>
  `,
  styles: [`
    .patient-container { max-width: 1100px; margin: 0 auto; padding: 2rem; font-family: 'Inter', sans-serif; }
    .welcome-banner { background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%); color: white; padding: 2rem; border-radius: 1.5rem; margin-bottom: 2rem; }
    .welcome-banner h1 { margin: 0; font-size: 2rem; }
    
    .dashboard-layout { display: grid; grid-template-columns: 280px 1fr; gap: 2rem; }
    .card { background: white; padding: 1.5rem; border-radius: 1rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); margin-bottom: 1.5rem; }
    .card h3 { margin-top: 0; color: #1e293b; border-bottom: 1px solid #f1f5f9; padding-bottom: 0.5rem; }

    .xray-box { padding: 1rem; border: 1px solid #f1f5f9; border-radius: 0.75rem; margin-bottom: 1rem; }
    .x-header { display: flex; justify-content: space-between; align-items: center; }
    .status { font-size: 0.7rem; font-weight: 800; background: #fee2e2; color: #991b1b; padding: 0.2rem 0.5rem; border-radius: 0.4rem; }
    .status.done { background: #d1fae5; color: #065f46; }

    .radiologist-selector { display: flex; flex-direction: column; gap: 0.5rem; margin-top: 1rem; background: #f8fafc; padding: 1rem; border-radius: 0.5rem; }
    .btn-schedule { background: #4f46e5; color: white; border: none; padding: 0.5rem; border-radius: 0.4rem; cursor: pointer; font-weight: 600; }
    .btn-schedule:disabled { opacity: 0.5; }

    .treatment-table .t-row { display: flex; justify-content: space-between; padding: 0.75rem 0; border-bottom: 1px solid #f1f5f9; }
    .price { font-weight: 700; color: #10b981; }

    .img-preview img { max-width: 100%; border-radius: 0.5rem; margin-top: 1rem; }
    .empty { color: #94a3b8; font-style: italic; }
  `]
})
export class PatientDashboard implements OnInit {
  private http = inject(HttpClient);
  private patientService = inject(PatientService);
  private xrayService = inject(XRayService);
  private treatmentService = inject(TreatmentService);
  private examService = inject(ClinicalExamService);

  patient = signal<any>(null);
  dentalRecord = signal<any>(null);
  xrayRequests = signal<any[]>([]);
  treatments = signal<any[]>([]);
  clinicalExam = signal<any>(null);
  affiliatedRadiologists = signal<any[]>([]);

  selectedRadId: number | null = null;
  appointmentDate: string = '';
  viewingId = signal<number | null>(null);

  ngOnInit() {
    this.loadMyData();
  }

  loadMyData() {
    // 1. Get Me
    this.http.get(API_ROUTES.PATIENTS.ME).subscribe((p: any) => {
      this.patient.set(p);
      const patientId = p.id;

      // 2. Load Records
      this.patientService.getDentalRecord(patientId).subscribe(r => this.dentalRecord.set(r));
      this.treatmentService.getByPatient(patientId).subscribe(t => this.treatments.set(t));
      this.examService.getByPatientId(patientId).subscribe(e => this.clinicalExam.set(e));
      
      // 3. Load X-Ray Requests
      this.http.get<any[]>(`${API_ROUTES.XRAY_REQUESTS.BASE}/my-patient`).subscribe(xrays => {
        this.xrayRequests.set(xrays);
        
        // If there's a request, get affiliated radiologists of the doctor
        if (xrays.length > 0) {
            const doctorId = xrays[0].doctor.id;
            this.http.get<any[]>(`${API_ROUTES.DOCTORS.BASE}/${doctorId}/radiologists`).subscribe(rads => {
                this.affiliatedRadiologists.set(rads);
            });
        }
      });
    });
  }

  confirmScheduling(requestId: number) {
    if (!this.selectedRadId || !this.appointmentDate) return;

    this.http.post(`${API_ROUTES.XRAY_REQUESTS.BASE}/${requestId}/select-radiologist`, null, {
        params: {
            radiologistId: this.selectedRadId.toString(),
            appointmentTime: this.appointmentDate
        }
    }).subscribe(() => {
        alert('Programare realizată cu succes!');
        this.loadMyData();
    });
  }

  toggleImage(id: number) {
    this.viewingId.set(this.viewingId() === id ? null : id);
  }

  getImageUrl(xrayId: number | undefined) {
    return xrayId ? this.xrayService.getImageUrl(xrayId) : '';
  }
}
