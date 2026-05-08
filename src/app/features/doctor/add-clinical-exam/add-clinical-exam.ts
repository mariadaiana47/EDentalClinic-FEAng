import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientSearch } from '../../../shared/components/patient-search/patient-search';
import { DentalChart } from '../../../shared/components/dental-chart/dental-chart';
import { Patient } from '../../../core/models/patient.model';
import { ClinicalExamService } from '../../../core/services/clinical-exam.service';
import { PatientService } from '../../../core/services/patient.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-clinical-exam',
  standalone: true,
  imports: [CommonModule, FormsModule, PatientSearch, DentalChart],
  template: `
    <div class="exam-container">
      <div class="header">
        <h2>Adăugare Examen Clinic</h2>
        <p>Completați schema dentară și detaliile clinice ale pacientului.</p>
      </div>

      <!-- Step 1: Search Patient (if no ID in URL) -->
      <div *ngIf="!selectedPatient()" class="step-card">
        <h3>Pasul 1: Selectați Pacientul</h3>
        <app-patient-search (patientSelected)="onPatientSelected($event)"></app-patient-search>
      </div>

      <!-- Step 2: The Form -->
      <div *ngIf="selectedPatient()" class="exam-form-container">
        <div class="patient-banner">
          <div class="patient-info">
            <i class="icon">👤</i>
            <div>
              <strong>{{ selectedPatient()?.lastName }} {{ selectedPatient()?.firstName }}</strong>
              <small>CNP: {{ selectedPatient()?.cnp }}</small>
            </div>
          </div>
          <button class="btn-change" (click)="cancel()" *ngIf="!routeId">Schimbă Pacient</button>
        </div>

        <form (submit)="onSubmit()" class="main-form">
          <div class="form-section">
            <h3><i class="icon">🦷</i> Schema Dentară</h3>
            <p class="section-hint">Selectați dinții care prezintă afecțiuni sau lucrări.</p>
            <app-dental-chart (selectionChange)="onTeethChange($event)"></app-dental-chart>
          </div>

          <div class="grid">
            <div class="form-section">
              <h3><i class="icon">📖</i> Istoricul Bolii</h3>
              <textarea [(ngModel)]="form.diseaseHistory" name="history" rows="4" placeholder="Detalii despre simptome..."></textarea>
            </div>

            <div class="form-section">
              <h3><i class="icon">🔍</i> Examen Dinți</h3>
              <textarea [(ngModel)]="form.teethExamination" name="teeth" rows="4" required placeholder="Observații..."></textarea>
            </div>
          </div>

          <div class="form-section">
            <h3><i class="icon">👄</i> Examen Mucoase</h3>
            <textarea [(ngModel)]="form.mucosaExamination" name="mucosa" rows="3" required placeholder="Gingii, mucoasă..."></textarea>
          </div>

          <div class="form-section">
            <h3><i class="icon">⚙️</i> Alte Elemente</h3>
            <div class="sub-grid">
              <div class="input-group">
                <label>Creste</label>
                <input type="text" [(ngModel)]="form.ridges" name="ridges">
              </div>
              <div class="input-group">
                <label>Tuberozități</label>
                <input type="text" [(ngModel)]="form.tuberosities" name="tuber">
              </div>
              <div class="input-group">
                <label>Boltă Palatină</label>
                <input type="text" [(ngModel)]="form.palatalVault" name="vault">
              </div>
            </div>
          </div>

          <div class="form-actions">
            <div *ngIf="success()" class="success-msg">Examen salvat cu succes!</div>
            <button type="button" class="btn-secondary" (click)="goBack()">Anulare</button>
            <button type="submit" class="btn-primary" [disabled]="loading()">
              {{ loading() ? 'Se salvează...' : 'Salvare Examen Clinic' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  `,
  styleUrls: ['./add-clinical-exam.css']
})
export class AddClinicalExam implements OnInit {
  private examService = inject(ClinicalExamService);
  private patientService = inject(PatientService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  selectedPatient = signal<Patient | null>(null);
  loading = signal(false);
  success = signal(false);
  routeId: number | null = null;

  form = {
    teethExamination: '',
    mucosaExamination: '',
    ridges: '',
    tuberosities: '',
    palatalVault: '',
    otherElements: '',
    diseaseHistory: '',
    selectedTeeth: [] as number[]
  };

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id) {
      this.routeId = id;
      this.patientService.byId(id).subscribe(p => this.selectedPatient.set(p));
    }
  }

  onPatientSelected(p: Patient) {
    this.selectedPatient.set(p);
  }

  onTeethChange(teeth: number[]) {
    this.form.selectedTeeth = teeth;
  }

  onSubmit() {
    const patient = this.selectedPatient();
    if (!patient) return;

    this.loading.set(true);
    
    const request = {
      dentalChart: JSON.stringify(this.form.selectedTeeth),
      teethExamination: this.form.teethExamination,
      mucosaExamination: this.form.mucosaExamination,
      ridges: this.form.ridges,
      tuberosities: this.form.tuberosities,
      palatalVault: this.form.palatalVault,
      otherElements: this.form.otherElements,
      diseaseHistory: this.form.diseaseHistory
    };

    this.examService.save(patient.id, request).subscribe({
      next: () => {
        this.loading.set(false);
        this.success.set(true);
        setTimeout(() => this.goBack(), 2000);
      },
      error: (err) => {
        this.loading.set(false);
        alert('Eroare la salvare: ' + (err.error?.message || 'Eroare necunoscută'));
      }
    });
  }

  goBack() {
    if (this.routeId) {
      this.router.navigate(['/doctor/patient', this.routeId]);
    } else {
      this.router.navigate(['/doctor/patients']);
    }
  }

  cancel() {
    this.selectedPatient.set(null);
  }
}
