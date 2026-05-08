import { Component } from '@angular/core';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  template: `
    <div class="dashboard-card">
      <h2>Bună ziua, Domnule Doctor!</h2>
      <p>Vizualizați programările și gestionați fișele medicale ale pacienților.</p>
      <div class="stats-grid">
        <div class="stat-box">
          <span class="label">Consultatii azi</span>
          <span class="value">0</span>
        </div>
        <div class="stat-box">
          <span class="label">Radiografii noi</span>
          <span class="value">0</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-card {
      background: white;
      padding: 2rem;
      border-radius: 1rem;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1rem;
      margin-top: 1.5rem;
    }
    .stat-box {
      background: #f0fdf4;
      padding: 1.5rem;
      border-radius: 0.75rem;
      border: 1px solid #dcfce7;
    }
    .label { font-size: 0.875rem; color: #166534; font-weight: 600; }
    .value { display: block; font-size: 2rem; font-weight: 700; color: #14532d; }
  `]
})
export class DoctorDashboard {}
