import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { PatientService } from '../../../core/services/patient.service';
import { DoctorService } from '../../../core/services/doctor.service';
import { Auth } from '../../../core/auth';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div>
      <div class="welcome-banner">
        <div>
          <h2 class="welcome-title">{{ greeting() }}, Dr. {{ auth.lastName() }}!</h2>
          <p class="welcome-sub">Gestionati fisele medicale si cererile de radiografie ale pacientilor.</p>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon"><i class="bi bi-people-fill"></i></div>
          <div class="stat-body">
            <div class="stat-value">{{ patientCount() ?? '—' }}</div>
            <div class="stat-label">Pacienti Activi</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><i class="bi bi-broadcast-pin"></i></div>
          <div class="stat-body">
            <div class="stat-value">{{ radiologistCount() ?? '—' }}</div>
            <div class="stat-label">Radiologi Afiliati</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><i class="bi bi-clipboard2-pulse-fill"></i></div>
          <div class="stat-body">
            <div class="stat-value">—</div>
            <div class="stat-label">Examene Clinice</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><i class="bi bi-image-fill"></i></div>
          <div class="stat-body">
            <div class="stat-value">—</div>
            <div class="stat-label">Radiografii în așteptare</div>
          </div>
        </div>
      </div>

      <div class="section-title">Actiuni Rapide</div>
      <div class="actions-grid">
        <a routerLink="/doctor/search" class="action-card">
          <div class="action-icon"><i class="bi bi-search"></i></div>
          <div class="action-label">Cauta Pacient</div>
          <div class="action-sub">dupa CNP sau nume</div>
        </a>
        <a routerLink="/doctor/patients" class="action-card">
          <div class="action-icon"><i class="bi bi-people"></i></div>
          <div class="action-label">Pacientii Mei</div>
          <div class="action-sub">lista completa</div>
        </a>
        <a routerLink="/doctor/radiologists" class="action-card">
          <div class="action-icon"><i class="bi bi-broadcast-pin"></i></div>
          <div class="action-label">Radiologi</div>
          <div class="action-sub">gestionare colaboratori</div>
        </a>
      </div>
    </div>
  `,
  styles: [`
    .welcome-banner {
      background: linear-gradient(135deg, #0d3d56 0%, #3cbdd4 100%);
      color: #fff; padding: 1.75rem 2rem; border-radius: 0.75rem; margin-bottom: 1.5rem;
    }
    .welcome-title { font-size: 1.4rem; font-weight: 700; margin: 0 0 0.375rem; }
    .welcome-sub { margin: 0; opacity: 0.8; font-size: 0.9rem; }

    .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; margin-bottom: 1.75rem; }
    .stat-card {
      background: #fff; border: 1px solid #e5e7eb; border-radius: 0.75rem;
      padding: 1.25rem; display: flex; align-items: center; gap: 1rem;
    }
    .stat-icon {
      width: 48px; height: 48px; border-radius: 0.6rem; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center; font-size: 1.3rem;
      background: #f0fbfd; color: #3cbdd4;
    }
    .stat-value { font-size: 1.6rem; font-weight: 700; color: #1a202c; line-height: 1; }
    .stat-label { font-size: 0.75rem; font-weight: 600; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.04em; margin-top: 0.2rem; }

    .section-title { font-size: 0.75rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.06em; color: #9ca3af; margin-bottom: 0.875rem; }
    .actions-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
    .action-card {
      background: #fff; border: 1px solid #e5e7eb; border-radius: 0.75rem;
      padding: 1.5rem 1.25rem; text-decoration: none; text-align: center;
      transition: border-color 0.15s, box-shadow 0.15s;
      display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
    }
    .action-card:hover { border-color: #3cbdd4; box-shadow: 0 4px 16px rgba(60,189,212,0.12); }
    .action-icon { font-size: 1.75rem; color: #3cbdd4; }
    .action-label { font-weight: 600; color: #1a202c; font-size: 0.9rem; }
    .action-sub { font-size: 0.78rem; color: #9ca3af; }

    @media (max-width: 1024px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
    }
    @media (max-width: 768px) {
      .welcome-banner { padding: 1.25rem 1.25rem; }
      .welcome-title { font-size: 1.2rem; }
      .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
      .actions-grid { grid-template-columns: repeat(2, 1fr); gap: 0.75rem; }
    }
    @media (max-width: 480px) {
      .welcome-banner { padding: 1rem; }
      .welcome-title { font-size: 1.1rem; }
      .stats-grid { grid-template-columns: 1fr 1fr; gap: 0.625rem; }
      .stat-card { padding: 1rem 0.875rem; gap: 0.75rem; }
      .stat-icon { width: 40px; height: 40px; font-size: 1.1rem; }
      .stat-value { font-size: 1.35rem; }
      .actions-grid { grid-template-columns: 1fr; }
      .action-card { flex-direction: row; text-align: left; padding: 1rem 1.25rem; gap: 1rem; justify-content: flex-start; }
      .action-icon { font-size: 1.4rem; flex-shrink: 0; }
    }
  `]
})
export class DoctorDashboard implements OnInit {
  private patientService = inject(PatientService);
  private doctorService = inject(DoctorService);
  auth = inject(Auth);

  patientCount = signal<number | null>(null);
  radiologistCount = signal<number | null>(null);

  readonly greeting = signal(new Date().getHours() >= 18 || new Date().getHours() < 5 ? 'Buna seara' : 'Buna ziua');

  ngOnInit() {
    this.patientService.list(true).subscribe(p => this.patientCount.set(p.length));
    this.doctorService.listAffiliatedRadiologists().subscribe(r => this.radiologistCount.set(r.length));
  }
}
