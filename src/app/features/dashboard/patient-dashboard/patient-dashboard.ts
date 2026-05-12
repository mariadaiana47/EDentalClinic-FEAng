import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../../core/services/patient.service';
import { XRayService } from '../../../core/services/xray.service';
import { TreatmentService } from '../../../core/services/treatment.service';
import { ClinicalExamService } from '../../../core/services/clinical-exam.service';
import { API_ROUTES } from '../../../core/constants/api-routes';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div *ngIf="patient(); else loadingTpl">
      <div class="welcome-banner">
        <h2 class="wb-name">{{ greeting }}, {{ patient().firstName }}!</h2>
        <p class="wb-sub">Acesta este dosarul tau medical digital EDentalClinic.</p>
      </div>

      <div class="pd-grid">
        <div class="pd-left">
          <div class="section-card">
            <div class="section-head"><i class="bi bi-person-fill"></i> Date Personale</div>
            <div class="section-body">
              <div class="info-row"><span class="info-label">CNP</span><span class="info-val">{{ patient().cnp }}</span></div>
              <div class="info-row"><span class="info-label">Varsta</span><span class="info-val">{{ patient().age }} ani</span></div>
              <div class="info-row last"><span class="info-label">Telefon</span><span class="info-val">{{ patient().phone }}</span></div>
            </div>
          </div>
          <div class="section-card">
            <div class="section-head"><i class="bi bi-heart-pulse-fill"></i> Sanatate</div>
            <div class="section-body">
              <p class="info-label">Status General</p>
              <p class="info-block">{{ dentalRecord()?.generalHealthStatus || 'Nu sunt date.' }}</p>
              <p class="info-label">Antecedente</p>
              <p class="info-block mb0">{{ dentalRecord()?.previousTreatments || 'Nu sunt date.' }}</p>
            </div>
          </div>
        </div>

        <div class="pd-right">

          <div class="section-card">
            <div class="section-head"><i class="bi bi-image-fill"></i> Cererile Mele de Radiografie</div>
            <div class="section-body">
              <div *ngFor="let x of xrayRequests()" class="xray-item">
                <div class="xray-top">
                  <div>
                    <span class="xray-type">{{ x.type }}</span>
                    <span class="xray-teeth">· Dinti: {{ x.teethInvolved }}</span>
                  </div>
                  <span class="xray-badge" [class.done]="x.status === 'COMPLETED'">{{ x.status }}</span>
                </div>

                <div *ngIf="x.status === 'PENDING' && !x.selectedRadiologist" class="scheduling-box">
                  <p class="sched-hint"><i class="bi bi-info-circle"></i> Alegeti un radiolog pentru aceasta investigatie:</p>
                  <div class="sched-row">
                    <select class="pd-input" [(ngModel)]="selectedRadId">
                      <option [value]="null">Selectati Radiologul</option>
                      <option *ngFor="let r of affiliatedRadiologists()" [value]="r.id">
                        {{ r.firstName }} {{ r.lastName }} – {{ r.clinicName }}
                      </option>
                    </select>
                    <input type="datetime-local" class="pd-input" [(ngModel)]="appointmentDate">
                    <button class="btn-confirm" (click)="confirmScheduling(x.id!)" [disabled]="!selectedRadId || !appointmentDate">
                      <i class="bi bi-check-lg"></i>
                    </button>
                  </div>
                </div>

                <div *ngIf="x.selectedRadiologist && x.status === 'PENDING'" class="scheduled-info">
                  <i class="bi bi-calendar-check"></i>
                  Programat la <strong>{{ x.selectedRadiologist.firstName }} {{ x.selectedRadiologist.lastName }}</strong>
                  pe <strong>{{ x.appointmentTime | date:'dd/MM/yyyy HH:mm' }}</strong>
                </div>

                <div *ngIf="x.status === 'COMPLETED'">
                  <button class="btn-view" (click)="toggleImage(x.id!)">
                    <i class="bi bi-eye"></i> {{ viewingId() === x.id ? 'Ascunde' : 'Vezi Radiografia' }}
                  </button>
                  <div *ngIf="viewingId() === x.id" class="xray-viewer">
                    <img [src]="getImageUrl(x.xray?.id)" alt="Radiografie" style="max-width:100%;border-radius:0.375rem;">
                  </div>
                </div>
              </div>
              <p *ngIf="xrayRequests().length === 0" class="empty-msg">Nu aveti cereri active.</p>
            </div>
          </div>

          <div class="section-card">
            <div class="section-head"><i class="bi bi-clipboard2-pulse-fill"></i> Examen Clinic</div>
            <div class="section-body">
              <div *ngIf="clinicalExam(); else noExam" class="two-col-grid">
                <div>
                  <p class="info-label">Observatii Medic</p>
                  <p class="info-block mb0">{{ clinicalExam().teethExamination }}</p>
                </div>
                <div>
                  <p class="info-label">Schema Dentara</p>
                  <p class="info-block mb0">{{ clinicalExam().dentalChart }}</p>
                </div>
              </div>
              <ng-template #noExam><p class="empty-msg">Niciun examen clinic inregistrat.</p></ng-template>
            </div>
          </div>

          <div class="section-card">
            <div class="section-head"><i class="bi bi-bandaid-fill"></i> Tratamente Efectuate</div>
            <div class="section-body">
              <div *ngFor="let t of treatments()" class="treatment-row">
                <span class="treat-desc">{{ t.description }}</span>
                <span class="treat-cost">{{ t.cost }} RON</span>
              </div>
              <p *ngIf="treatments().length === 0" class="empty-msg">Niciun tratament inregistrat.</p>
            </div>
          </div>

        </div>
      </div>
    </div>

    <ng-template #loadingTpl>
      <div class="loading-state">
        <div class="pd-spinner"></div>
        <p class="loading-text">Se incarca dosarul...</p>
      </div>
    </ng-template>
  `,
  styles: [`
    .welcome-banner { background: linear-gradient(135deg, #0d3d56 0%, #3cbdd4 100%); color: #fff; padding: 1.75rem 2rem; border-radius: 0.75rem; margin-bottom: 1.5rem; }
    .wb-name { font-size: 1.4rem; font-weight: 700; margin: 0 0 0.25rem; color: #fff; }
    .wb-sub { margin: 0; opacity: 0.85; font-size: 0.9rem; color: #fff; }

    .pd-grid { display: grid; grid-template-columns: 270px 1fr; gap: 1.25rem; align-items: start; }

    .section-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 0.75rem; overflow: hidden; margin-bottom: 1.25rem; }
    .section-card:last-child { margin-bottom: 0; }
    .section-head { background: #f7fdfe; border-bottom: 1px solid #d9f2f7; padding: 0.875rem 1.25rem; font-weight: 600; color: #1a202c; display: flex; align-items: center; gap: 0.5rem; font-size: 0.9rem; justify-content: flex-start; }
    .section-head i { color: #3cbdd4; }
    .section-body { padding: 1.25rem; }

    .info-row { display: flex; flex-direction: column; padding-bottom: 0.75rem; border-bottom: 1px solid #f3f4f6; margin-bottom: 0.75rem; }
    .info-row.last { border-bottom: none; padding-bottom: 0; margin-bottom: 0; }
    .info-label { font-size: 0.72rem; font-weight: 700; text-transform: uppercase; color: #9ca3af; letter-spacing: 0.04em; margin: 0 0 0.2rem; }
    .info-val { color: #374151; font-size: 0.9rem; margin: 0; }
    .info-block { color: #374151; font-size: 0.875rem; margin: 0 0 0.75rem; }
    .mb0 { margin-bottom: 0 !important; }

    .two-col-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

    .xray-item { padding-bottom: 1rem; border-bottom: 1px solid #f3f4f6; margin-bottom: 1rem; }
    .xray-item:last-child { border-bottom: none; padding-bottom: 0; margin-bottom: 0; }
    .xray-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem; }
    .xray-type { font-weight: 600; color: #1a202c; font-size: 0.9rem; }
    .xray-teeth { color: #6b7280; font-size: 0.82rem; margin-left: 0.4rem; }
    .xray-badge { font-size: 0.7rem; font-weight: 700; padding: 0.2rem 0.6rem; background: #fee2e2; color: #991b1b; border-radius: 0.375rem; text-transform: uppercase; }
    .xray-badge.done { background: #d1fae5; color: #065f46; }

    .scheduling-box { background: #f7fdfe; border: 1px solid #d9f2f7; border-radius: 0.5rem; padding: 0.875rem 1rem; }
    .sched-hint { font-size: 0.82rem; color: #6b7280; margin: 0 0 0.75rem; display: flex; align-items: center; gap: 0.4rem; }
    .sched-row { display: grid; grid-template-columns: 1fr 1fr auto; gap: 0.5rem; align-items: center; }
    .pd-input { padding: 0.5rem 0.75rem; border: 1px solid #d1d5db; border-radius: 0.45rem; font-size: 0.875rem; color: #1a202c; background: #fff; outline: none; width: 100%; font-family: inherit; }
    .pd-input:focus { border-color: #3cbdd4; box-shadow: 0 0 0 3px rgba(60,189,212,0.12); }

    .btn-confirm { padding: 0.5rem 0.875rem; background: #3cbdd4; color: #fff; border: none; border-radius: 0.45rem; cursor: pointer; font-weight: 600; }
    .btn-confirm:disabled { background: #a8dfe9; cursor: not-allowed; }
    .btn-confirm:hover:not(:disabled) { background: #2aa8bf; }

    .scheduled-info { background: #eff8fd; border-left: 3px solid #3cbdd4; padding: 0.5rem 0.75rem; font-size: 0.875rem; color: #374151; border-radius: 0 0.375rem 0.375rem 0; display: flex; align-items: center; gap: 0.4rem; }
    .xray-viewer { background: #0f172a; padding: 1rem; border-radius: 0.5rem; margin-top: 0.75rem; }

    .btn-view { display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.4rem 0.875rem; background: transparent; border: 1px solid #3cbdd4; border-radius: 0.45rem; color: #3cbdd4; font-size: 0.82rem; font-weight: 600; cursor: pointer; margin-top: 0.5rem; }
    .btn-view:hover { background: #3cbdd4; color: #fff; }

    .treatment-row { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid #f3f4f6; }
    .treatment-row:last-child { border-bottom: none; }
    .treat-desc { color: #374151; font-weight: 500; font-size: 0.875rem; }
    .treat-cost { font-weight: 700; color: #3cbdd4; font-size: 0.875rem; }

    .empty-msg { color: #9ca3af; font-style: italic; font-size: 0.875rem; margin: 0; }

    .loading-state { text-align: center; padding: 4rem; }
    .loading-text { color: #9ca3af; margin-top: 1rem; font-size: 0.9rem; }
    .pd-spinner { width: 32px; height: 32px; border-radius: 50%; border: 3px solid #d9f2f7; border-top-color: #3cbdd4; animation: spin 0.7s linear infinite; display: inline-block; }
    @keyframes spin { to { transform: rotate(360deg); } }

    @media (max-width: 900px) {
      .pd-grid { grid-template-columns: 1fr; }
      .sched-row { grid-template-columns: 1fr; }
      .two-col-grid { grid-template-columns: 1fr; }
    }
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
    this.http.get(API_ROUTES.PATIENTS.ME).subscribe((p: any) => {
      this.patient.set(p);
      const patientId = p.id;

      this.patientService.getDentalRecord(patientId).subscribe(r => this.dentalRecord.set(r));
      this.treatmentService.getByPatient(patientId).subscribe(t => this.treatments.set(t));
      this.examService.getByPatientId(patientId).subscribe(e => this.clinicalExam.set(e));

      this.http.get<any[]>(`${API_ROUTES.XRAY_REQUESTS.BASE}/my-patient`).subscribe(xrays => {
        this.xrayRequests.set(xrays);

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
      alert('Programare realizata cu succes!');
      this.loadMyData();
    });
  }

  toggleImage(id: number) {
    this.viewingId.set(this.viewingId() === id ? null : id);
  }

  getImageUrl(xrayId: number | undefined) {
    return xrayId ? this.xrayService.getImageUrl(xrayId) : '';
  }

  get greeting(): string {
    const hour = new Date().getHours();
    return hour >= 18 || hour < 5 ? 'Buna seara' : 'Buna ziua';
  }
}
