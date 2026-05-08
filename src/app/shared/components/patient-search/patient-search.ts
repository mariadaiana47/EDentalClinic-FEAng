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
    <div class="search-container">
      <div class="search-box">
        <input 
          type="text" 
          [(ngModel)]="query" 
          (keyup.enter)="onSearch()"
          placeholder="Caută pacient după Nume sau CNP..."
          class="search-input"
        >
        <button (click)="onSearch()" class="search-btn" [disabled]="loading()">
          <span *ngIf="!loading()">🔍 Caută</span>
          <span *ngIf="loading()">...</span>
        </button>
      </div>

      <div *ngIf="patients().length > 0" class="results-list">
        <div *ngFor="let p of patients()" class="patient-card" (click)="select(p)">
          <div class="info">
            <strong>{{ p.lastName }} {{ p.firstName }}</strong>
            <small>CNP: {{ p.cnp }}</small>
          </div>
          <button class="btn-select">Selectează</button>
        </div>
      </div>

      <div *ngIf="hasSearched() && patients().length === 0 && !loading()" class="no-results">
        Niciun pacient găsit pentru "{{ query }}".
      </div>
    </div>
  `,
  styles: [`
    .search-container { margin-bottom: 2rem; }
    .search-box { display: flex; gap: 0.5rem; background: white; padding: 0.5rem; border-radius: 0.75rem; box-shadow: 0 2px 4px rgba(0,0,0,0.05); }
    .search-input { flex: 1; border: none; padding: 0.75rem; font-size: 1rem; outline: none; }
    .search-btn { background: #3b82f6; color: white; border: none; padding: 0 1.5rem; border-radius: 0.5rem; font-weight: 600; cursor: pointer; }
    .results-list { margin-top: 1rem; display: grid; gap: 0.75rem; }
    .patient-card { background: white; padding: 1rem; border-radius: 0.75rem; display: flex; justify-content: space-between; align-items: center; cursor: pointer; transition: transform 0.2s; border: 1px solid #f1f5f9; }
    .patient-card:hover { transform: translateY(-2px); border-color: #3b82f6; }
    .info { display: flex; flex-direction: column; }
    .info strong { color: #1e293b; }
    .info small { color: #64748b; }
    .btn-select { background: #f1f5f9; border: none; padding: 0.5rem 1rem; border-radius: 0.4rem; font-size: 0.875rem; font-weight: 600; color: #3b82f6; }
    .no-results { margin-top: 1rem; color: #64748b; text-align: center; font-style: italic; }
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
    
    // Simplificăm: dacă query are 13 cifre e CNP, altfel e nume
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
