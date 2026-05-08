import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../../core/services/patient.service';
import { ClinicalExamService } from '../../../core/services/clinical-exam.service';
import { TreatmentService, Treatment } from '../../../core/services/treatment.service';
import { XRayService, XRayRequest } from '../../../core/services/xray.service';
import { Patient } from '../../../core/models/patient.model';

@Component({
  selector: 'app-patient-details',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  template: `
    <div class="details-container" *ngIf="patient(); else loadingTemplate">
      <!-- Top Banner -->
      <div class="patient-header">
        <div class="avatar-large">{{ patient()?.lastName?.[0] }}{{ patient()?.firstName?.[0] }}</div>
        <div class="meta">
          <h1>{{ patient()?.lastName }} {{ patient()?.firstName }}</h1>
          <div class="badges">
            <span class="badge">CNP: {{ patient()?.cnp }}</span>
            <span class="badge">{{ patient()?.gender === 'M' ? 'Bărbat' : 'Femeie' }}</span>
            <span class="badge">{{ patient()?.age }} ani</span>
          </div>
        </div>
        <div class="actions">
          <button class="btn-action primary" [routerLink]="['/doctor/patient', patient()?.id, 'add-clinical-exam']">
            + Adaugă Examen Clinic
          </button>
          <button class="btn-action secondary" (click)="showXrayForm.set(true)">
            📡 Solicită Radiografie
          </button>
        </div>
      </div>

      <div class="dashboard-grid">
        <!-- Sidebar Info -->
        <div class="sidebar">
          <div class="card">
            <h3>Date Contact</h3>
            <p>📧 {{ patient()?.email }}</p>
            <p>📞 {{ patient()?.phone }}</p>
            <p>🎂 {{ patient()?.birthDate }}</p>
          </div>
          
          <div class="card status-card">
            <h3>Status Sănătate Generală</h3>
            <div class="status-content">
              <p class="label">Observații Asistent:</p>
              <p class="status-text">{{ dentalRecord()?.generalHealthStatus || 'Niciun status raportat.' }}</p>
            </div>
            <div class="status-content" style="margin-top: 1rem;">
              <p class="label">Tratamente Anterioare:</p>
              <p class="status-text">{{ dentalRecord()?.previousTreatments || 'Fără antecedente.' }}</p>
            </div>
          </div>
        </div>

        <!-- Main Content -->
        <div class="main-content">
          
          <!-- X-Ray Request Form -->
          <div *ngIf="showXrayForm()" class="card section highlight">
            <div class="section-header">
              <h3>Cerere Radiografie Nouă</h3>
              <button class="btn-cancel" (click)="showXrayForm.set(false)">X</button>
            </div>
            <div class="xray-form">
              <div class="form-row">
                <input type="text" [(ngModel)]="newXray.teethInvolved" placeholder="Dinți vizați (ex: 18, 28)">
                <select [(ngModel)]="newXray.type">
                  <option value="3D">Radiografie 3D</option>
                  <option value="Panoramica">Panoramică</option>
                  <option value="Retroalveolara">Retroalveolară</option>
                </select>
              </div>
              <textarea [(ngModel)]="newXray.details" placeholder="Detalii suplimentare pentru radiolog..."></textarea>
              <button class="btn-save" (click)="saveXrayRequest()">Trimite Cererea</button>
            </div>
          </div>

          <!-- Clinical Exam -->
          <div class="card section">
            <div class="section-header">
              <h3><i class="icon">🦷</i> Examen Clinic</h3>
            </div>
            <div *ngIf="clinicalExam(); else noExam" class="exam-summary">
              <p><strong>Dinti:</strong> {{ clinicalExam().dentalChart }}</p>
              <p><strong>Observații:</strong> {{ clinicalExam().teethExamination }}</p>
            </div>
            <ng-template #noExam><div class="empty-msg">Nu există examen clinic.</div></ng-template>
          </div>

          <!-- X-Ray History -->
          <div class="card section">
            <h3><i class="icon">📷</i> Istoric Radiografii</h3>
            <div class="xray-list">
              <div *ngFor="let x of xrayRequests()" class="xray-container">
                <div class="xray-item">
                  <div class="x-info">
                    <span class="x-type">{{ x.type }} - Dinți: {{ x.teethInvolved }}</span>
                    <span class="x-status" [class.status-pending]="x.status === 'PENDING'">{{ x.status }}</span>
                  </div>
                  <div class="x-actions">
                    <button *ngIf="x.status === 'COMPLETED'" class="btn-view" (click)="toggleImage(x.id!)">
                      {{ expandedXray() === x.id ? 'Ascunde' : '👁️ Vezi Radiografie' }}
                    </button>
                    <span class="x-date">{{ x.createdAt | date:'shortDate' }}</span>
                  </div>
                </div>
                
                <!-- Image Display -->
                <div *ngIf="expandedXray() === x.id" class="image-viewer">
                  <img [src]="getImageUrl(x.xray?.id)" alt="Radiografie" class="xray-img">
                  <p class="obs" *ngIf="x.xray?.observations"><strong>Observații radiolog:</strong> {{ x.xray?.observations }}</p>
                </div>
              </div>
              <div *ngIf="xrayRequests().length === 0" class="empty-msg">Nicio cerere de radiografie.</div>
            </div>
          </div>

          <!-- Treatments -->
          <div class="card section">
            <div class="section-header"><h3><i class="icon">🛠️</i> Tratamente</h3></div>
            <div class="treatment-list">
              <div *ngFor="let t of treatments()" class="treatment-item">
                <div class="t-main"><strong>{{ t.description }}</strong> ({{ t.teethInvolved }})</div>
                <div class="t-meta"><span>{{ t.cost }} RON</span></div>
              </div>
              <div *ngIf="treatments().length === 0" class="empty-msg">Niciun tratament.</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ng-template #loadingTemplate><div class="loading">Se încarcă...</div></ng-template>
  `,
  styleUrls: ['./patient-details.css']
})
export class PatientDetails implements OnInit {
  private route = inject(ActivatedRoute);
  private patientService = inject(PatientService);
  private examService = inject(ClinicalExamService);
  private treatmentService = inject(TreatmentService);
  private xrayService = inject(XRayService);

  patient = signal<Patient | null>(null);
  dentalRecord = signal<any>(null);
  clinicalExam = signal<any>(null);
  treatments = signal<Treatment[]>([]);
  xrayRequests = signal<any[]>([]);

  newTreatment: Treatment = { description: '', cost: 0, teethInvolved: '' };
  showAddTreatment = signal(false);

  newXray: XRayRequest = { teethInvolved: '', type: '3D', details: '' };
  showXrayForm = signal(false);
  
  expandedXray = signal<number | null>(null);

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.loadData(id);
    }
  }

  loadData(id: number) {
    this.patientService.byId(id).subscribe(p => this.patient.set(p));
    this.patientService.getDentalRecord(id).subscribe(r => this.dentalRecord.set(r));
    this.examService.getByPatientId(id).subscribe(e => this.clinicalExam.set(e));
    this.treatmentService.getByPatient(id).subscribe(t => this.treatments.set(t));
    this.xrayService.getByPatient(id).subscribe(x => this.xrayRequests.set(x));
  }

  saveXrayRequest() {
    const id = this.patient()?.id;
    if (!id || !this.newXray.teethInvolved) return;
    this.xrayService.create(id, this.newXray).subscribe(() => {
      this.loadData(id);
      this.showXrayForm.set(false);
      this.newXray = { teethInvolved: '', type: '3D', details: '' };
    });
  }

  saveTreatment() {
    const id = this.patient()?.id;
    if (!id || !this.newTreatment.description) return;
    this.treatmentService.add(id, this.newTreatment).subscribe(() => {
      this.loadData(id);
      this.showAddTreatment.set(false);
    });
  }

  toggleImage(requestId: number) {
    if (this.expandedXray() === requestId) {
      this.expandedXray.set(null);
    } else {
      this.expandedXray.set(requestId);
    }
  }

  getImageUrl(xrayId: number | undefined): string {
    if (!xrayId) return '';
    return this.xrayService.getImageUrl(xrayId);
  }
}
