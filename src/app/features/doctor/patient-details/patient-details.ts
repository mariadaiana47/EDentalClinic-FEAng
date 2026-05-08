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
            <span class="badge secondary">{{ patient()?.age }} ani</span>
          </div>
        </div>
        <div class="actions">
          <button class="btn-action primary" [routerLink]="['/doctor/patient', patient()?.id, 'add-clinical-exam']">
            🦷 Examen Clinic Nou
          </button>
          <button class="btn-action accent" (click)="showXrayForm.set(true)">
            📡 Solicită Radiografie
          </button>
        </div>
      </div>

      <div class="dashboard-grid">
        <!-- Sidebar: Patient Info & Health Status -->
        <div class="sidebar">
          <div class="card info-card">
            <h3>Date Contact</h3>
            <div class="contact-item">📧 {{ patient()?.email }}</div>
            <div class="contact-item">📞 {{ patient()?.phone }}</div>
          </div>
          
          <div class="card status-card highlight-status">
            <h3>Status Sănătate (Asistent)</h3>
            <div class="status-box">
              <label>Analize/Stare Actuală:</label>
              <p>{{ dentalRecord()?.generalHealthStatus || 'Nicio observație raportată.' }}</p>
            </div>
            <div class="status-box">
              <label>Antecedente:</label>
              <p>{{ dentalRecord()?.previousTreatments || 'Fără antecedente declarate.' }}</p>
            </div>
          </div>
        </div>

        <!-- Main Content: Exams, X-Rays, Treatments -->
        <div class="main-content">
          
          <!-- X-Ray Request Form (Modal-like) -->
          <div *ngIf="showXrayForm()" class="card section form-card">
            <div class="section-header">
              <h3>Cerere Radiografie</h3>
              <button class="close-btn" (click)="showXrayForm.set(false)">×</button>
            </div>
            <div class="form-body">
              <div class="input-group">
                <input type="text" [(ngModel)]="newXray.teethInvolved" placeholder="Dinți vizați (ex: 11, 21)">
                <select [(ngModel)]="newXray.type">
                  <option value="3D">Radiografie 3D</option>
                  <option value="Panoramica">Panoramică</option>
                  <option value="Retroalveolara">Retroalveolară</option>
                </select>
              </div>
              <textarea [(ngModel)]="newXray.details" placeholder="Note pentru radiolog..."></textarea>
              <button class="btn-submit" (click)="saveXrayRequest()">Trimite Cererea</button>
            </div>
          </div>

          <!-- Clinical Exam Summary -->
          <div class="card section">
            <div class="section-header">
              <h3>🦷 Ultimul Examen Clinic</h3>
            </div>
            <div *ngIf="clinicalExam(); else noExam" class="exam-display">
              <div class="exam-grid">
                <div><strong>Dinți:</strong> {{ clinicalExam().dentalChart }}</div>
                <div><strong>Data:</strong> {{ clinicalExam().createdAt | date:'shortDate' }}</div>
              </div>
              <div class="exam-obs"><strong>Observații:</strong> {{ clinicalExam().teethExamination }}</div>
            </div>
            <ng-template #noExam><div class="empty-state">Nu există examene clinice înregistrate.</div></ng-template>
          </div>

          <!-- X-Ray History with Viewer -->
          <div class="card section">
            <h3>📷 Istoric Radiografii</h3>
            <div class="xray-stack">
              <div *ngFor="let x of xrayRequests()" class="xray-entry">
                <div class="xray-row">
                  <div class="x-info">
                    <span class="x-title">{{ x.type }} - Dinți: {{ x.teethInvolved }}</span>
                    <span class="status-pill" [class.completed]="x.status === 'COMPLETED'">{{ x.status }}</span>
                  </div>
                  <div class="x-actions">
                    <button *ngIf="x.status === 'COMPLETED'" class="btn-view" (click)="toggleImage(x.id!)">
                      {{ expandedXray() === x.id ? 'Închide' : '👁️ Vezi Rezultat' }}
                    </button>
                    <span class="date-text">{{ x.createdAt | date:'dd/MM/yy' }}</span>
                  </div>
                </div>
                <div *ngIf="expandedXray() === x.id" class="viewer-container">
                   <img [src]="getImageUrl(x.xray?.id)" alt="X-Ray" class="main-image">
                   <p class="image-obs" *ngIf="x.xray?.observations">💬 {{ x.xray?.observations }}</p>
                </div>
              </div>
              <div *ngIf="xrayRequests().length === 0" class="empty-state">Nicio radiografie solicitată.</div>
            </div>
          </div>

          <!-- Treatments List & Add -->
          <div class="card section">
            <div class="section-header">
              <h3>🛠️ Tratamente Efectuate</h3>
              <button class="btn-plus" (click)="showAddTreatment.set(!showAddTreatment())">{{ showAddTreatment() ? '× Închide' : '+ Adaugă' }}</button>
            </div>
            
            <div *ngIf="showAddTreatment()" class="add-treatment-form">
               <input type="text" [(ngModel)]="newTreatment.description" placeholder="Descriere tratament">
               <input type="text" [(ngModel)]="newTreatment.teethInvolved" placeholder="Dinți">
               <input type="number" [(ngModel)]="newTreatment.cost" placeholder="Preț (RON)">
               <button class="btn-save-treatment" (click)="saveTreatment()">Salvează</button>
            </div>

            <div class="treatment-table">
              <div *ngFor="let t of treatments()" class="treatment-row">
                <div class="t-desc"><strong>{{ t.description }}</strong> <small>({{ t.teethInvolved }})</small></div>
                <div class="t-price">{{ t.cost }} RON</div>
                <div class="t-date">{{ t.createdAt | date:'shortDate' }}</div>
              </div>
              <div *ngIf="treatments().length === 0" class="empty-state">Niciun tratament înregistrat încă.</div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <ng-template #loadingTemplate><div class="loading-screen">Se încarcă dosarul pacientului...</div></ng-template>
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
    if (!id || !this.newTreatment.description) {
      alert('Vă rugăm să introduceți o descriere pentru tratament.');
      return;
    }
    
    console.log('Saving treatment for patient:', id, this.newTreatment);
    
    this.treatmentService.add(id, this.newTreatment).subscribe({
      next: () => {
        console.log('Treatment saved successfully!');
        this.loadData(id);
        this.showAddTreatment.set(false);
        this.newTreatment = { description: '', cost: 0, teethInvolved: '' };
      },
      error: (err) => {
        console.error('Error saving treatment:', err);
        alert('Eroare la salvarea tratamentului: ' + (err.error?.message || err.message));
      }
    });
  }

  toggleImage(requestId: number) {
    this.expandedXray.set(this.expandedXray() === requestId ? null : requestId);
  }

  getImageUrl(xrayId: number | undefined): string {
    return xrayId ? this.xrayService.getImageUrl(xrayId) : '';
  }
}
