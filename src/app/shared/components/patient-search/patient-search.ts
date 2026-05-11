import { Component, EventEmitter, Output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PatientService } from '../../../core/services/patient.service';
import { Patient } from '../../../core/models/patient.model';

@Component({
  selector: 'app-patient-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <div class="input-group mb-3">
        <span class="input-group-text bg-white border-end-0">
          <i class="bi bi-search text-muted"></i>
        </span>
        <input type="text" class="form-control border-start-0 ps-0"
          [(ngModel)]="query" (keyup.enter)="onSearch()"
          placeholder="Cauta pacient dupa Nume sau CNP...">
        <button class="btn btn-clinic px-4" (click)="onSearch()" [disabled]="loading()">
          <span *ngIf="!loading()">Cauta</span>
          <span *ngIf="loading()"><span class="spinner-border spinner-border-sm"></span></span>
        </button>
      </div>

      <div *ngIf="patients().length > 0" class="results-list">
        <div *ngFor="let p of patients()" class="result-item d-flex justify-content-between align-items-center"
          (click)="select(p)">
          <div class="d-flex align-items-center gap-3">
            <div class="res-avatar">{{ p.lastName[0] }}{{ p.firstName[0] }}</div>
            <div>
              <div class="fw-semibold">{{ p.lastName }} {{ p.firstName }}</div>
              <div class="text-muted small">CNP: {{ p.cnp }}</div>
            </div>
          </div>
          <button class="btn btn-sm btn-outline-clinic">Selecteaza</button>
        </div>
      </div>

      <div *ngIf="hasSearched() && patients().length === 0 && !loading()"
        class="text-center text-muted fst-italic py-3">
        Niciun pacient gasit pentru "{{ query }}".
      </div>
    </div>
  `,
  styles: [`
    .btn-clinic { background: #3cbdd4; border: none; color: #fff; font-weight: 600; }
    .btn-clinic:hover:not(:disabled) { background: #2aa8bf; color: #fff; }
    .btn-outline-clinic { color: #3cbdd4; border-color: #3cbdd4; font-weight: 600; }
    .btn-outline-clinic:hover { background: #3cbdd4; color: #fff; }
    .results-list { display: flex; flex-direction: column; gap: 0.5rem; }
    .result-item {
      padding: 0.875rem 1rem; background: #f7fdfe;
      border: 1px solid #d9f2f7; border-radius: 0.5rem;
      cursor: pointer; transition: border-color 0.15s;
    }
    .result-item:hover { border-color: #3cbdd4; }
    .res-avatar {
      width: 36px; height: 36px; border-radius: 50%;
      background: linear-gradient(135deg, #3cbdd4, #2891a8);
      color: white; display: flex; align-items: center; justify-content: center;
      font-size: 0.8rem; font-weight: 700; flex-shrink: 0;
    }
  `]
})
export class PatientSearch {
  private patientService = inject(PatientService);

  @Output() patientSelected = new EventEmitter<Patient>();

  query = '';
  patients = signal<Patient[]>([]);
  loading = signal(false);
  hasSearched = signal(false);

  onSearch() {
    if (!this.query.trim()) return;

    this.loading.set(true);
    this.hasSearched.set(true);
    
    // Simplificam: daca query are 13 cifre e CNP, altfel e nume
    const criteria = isNaN(Number(this.query)) || this.query.length !== 13 
      ? { name: this.query } 
      : { cnp: this.query };

    this.patientService.search(criteria).subscribe({
      next: (data) => {
        this.patients.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.patients.set([]);
        this.loading.set(false);
      }
    });
  }

  select(p: Patient) {
    this.patientSelected.emit(p);
    this.patients.set([]);
    this.query = '';
  }
}
