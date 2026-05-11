import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PatientService } from '../../../core/services/patient.service';
import { Patient } from '../../../core/models/patient.model';

@Component({
  selector: 'app-patient-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <div class="page-header">
        <h2 class="page-title">{{ isMine ? 'Pacientii Mei' : 'Lista Pacienti' }}</h2>
        <p class="page-sub">{{ isMine ? 'Gestionati pacientii pe care ii aveti in tratament.' : 'Gestionati si vizualizati dosarele medicale ale pacientilor clinicii.' }}</p>
      </div>

      <div class="search-bar">
        <i class="bi bi-search"></i>
        <input type="text" [(ngModel)]="searchQuery" (input)="onSearch()" placeholder="Cauta dupa nume sau CNP...">
        <span *ngIf="filteredPatients().length > 0" class="count-badge">{{ filteredPatients().length }} pacienti</span>
      </div>

      <div class="table-card" *ngIf="!loading(); else loadingTpl">
        <table>
          <thead>
            <tr>
              <th>Pacient</th>
              <th>CNP</th>
              <th>Telefon</th>
              <th>Status</th>
              <th>Actiuni</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let p of filteredPatients()" class="patient-row">
              <td>
                <div class="patient-cell">
                  <div class="pt-avatar">{{ p.lastName[0] }}{{ p.firstName[0] }}</div>
                  <span class="pt-name">{{ p.lastName }} {{ p.firstName }}</span>
                </div>
              </td>
              <td><span class="cnp-chip">{{ p.cnp }}</span></td>
              <td class="td-muted">{{ p.phone }}</td>
              <td><span class="status-badge">Activ</span></td>
              <td>
                <button class="btn-view" (click)="viewPatient(p.id)">
                  <i class="bi bi-folder2-open"></i> Vezi Dosar
                </button>
              </td>
            </tr>
            <tr *ngIf="filteredPatients().length === 0">
              <td colspan="5" class="empty-row">Nu s-au gasit pacienti conform criteriilor.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <ng-template #loadingTpl>
        <div class="loading-state">
          <div class="spinner-border" style="color:#3cbdd4; width:2rem; height:2rem;"></div>
          <p>Se incarca lista pacientilor...</p>
        </div>
      </ng-template>
    </div>
  `,
  styles: [`
    .page-header { margin-bottom: 1.75rem; }
    .page-title { font-size: 1.5rem; font-weight: 700; color: #1a202c; margin: 0 0 0.25rem; }
    .page-sub { color: #6b7280; font-size: 0.9rem; margin: 0; }

    .search-bar {
      display: flex; align-items: center; gap: 0.75rem;
      background: #fff; border: 1px solid #e5e7eb; border-radius: 0.6rem;
      padding: 0.65rem 1rem; margin-bottom: 1rem;
    }
    .search-bar i { color: #9ca3af; font-size: 1rem; flex-shrink: 0; }
    .search-bar input { flex: 1; border: none; outline: none; font-size: 0.9rem; color: #1a202c; background: transparent; }
    .search-bar input::placeholder { color: #9ca3af; }
    .count-badge {
      background: #3cbdd4; color: #fff; font-size: 0.75rem; font-weight: 600;
      padding: 0.2rem 0.65rem; border-radius: 999px; flex-shrink: 0;
    }

    .table-card { background: #fff; border: 1px solid #e5e7eb; border-radius: 0.75rem; overflow: hidden; }
    table { width: 100%; border-collapse: collapse; }
    thead tr { background: #f9fafb; border-bottom: 1px solid #e5e7eb; }
    th { padding: 0.75rem 1.25rem; font-size: 0.72rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; text-align: left; }
    td { padding: 0.875rem 1.25rem; border-bottom: 1px solid #f3f4f6; vertical-align: middle; text-align: left; }
    .patient-row:last-child td { border-bottom: none; }
    .patient-row:hover td { background: #f9feff; }

    .patient-cell { display: flex; align-items: center; gap: 0.625rem; }
    .pt-avatar {
      width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
      background: linear-gradient(135deg, #3cbdd4, #2891a8);
      color: #fff; display: flex; align-items: center; justify-content: center;
      font-size: 0.72rem; font-weight: 700;
    }
    .pt-name { font-weight: 600; color: #1a202c; font-size: 0.9rem; }
    .cnp-chip { font-family: monospace; font-size: 0.82rem; background: #f3f4f6; color: #374151; padding: 0.2rem 0.5rem; border-radius: 0.3rem; }
    .td-muted { color: #6b7280; font-size: 0.875rem; }
    .status-badge { background: #dcfce7; color: #16a34a; font-size: 0.75rem; font-weight: 600; padding: 0.2rem 0.6rem; border-radius: 999px; }
    .btn-view {
      display: inline-flex; align-items: center; gap: 0.35rem;
      background: #3cbdd4; border: none; color: #fff; font-size: 0.8rem; font-weight: 600;
      padding: 0.4rem 0.875rem; border-radius: 0.4rem; cursor: pointer; transition: background 0.15s;
    }
    .btn-view:hover { background: #2aa8bf; }

    .empty-row { text-align: center; color: #9ca3af; font-style: italic; padding: 2.5rem !important; }
    .loading-state { text-align: center; padding: 3rem; }
    .loading-state p { color: #6b7280; margin-top: 0.75rem; }
  `]
})
export class PatientList implements OnInit {
  private patientService = inject(PatientService);
  private router = inject(Router);

  allPatients = signal<Patient[]>([]);
  filteredPatients = signal<Patient[]>([]);
  loading = signal(true);
  searchQuery = '';
  isMine = false;
  private route = inject(ActivatedRoute);

  ngOnInit() {
    this.isMine = this.router.url.includes('patients');
    this.loadPatients();
  }

  loadPatients() {
    this.patientService.list(this.isMine).subscribe({
      next: (data) => {
        this.allPatients.set(data);
        this.filteredPatients.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      }
    });
  }

  onSearch() {
    const query = this.searchQuery.toLowerCase();
    if (!query) {
      this.filteredPatients.set(this.allPatients());
      return;
    }

    this.filteredPatients.set(
      this.allPatients().filter(p =>
        p.lastName.toLowerCase().includes(query) ||
        p.firstName.toLowerCase().includes(query) ||
        p.cnp.includes(query)
      )
    );
  }

  viewPatient(id: number) {
    this.router.navigate(['/doctor/patient', id]);
  }
}
