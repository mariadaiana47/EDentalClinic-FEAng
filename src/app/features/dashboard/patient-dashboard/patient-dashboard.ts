import { Component } from '@angular/core';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  template: `
    <div class="dashboard-card">
      <h2>Dosarul tău medical</h2>
      <p>Aici poți vedea istoricul tratamentelor și radiografiile tale.</p>
      <div class="info-grid">
        <div class="info-box">
          <h3>Ultima vizită</h3>
          <p>Nu există programări recente.</p>
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
    .info-grid { margin-top: 1.5rem; }
    .info-box {
      background: #fafafa;
      padding: 1.5rem;
      border-radius: 0.75rem;
      border: 1px solid #eee;
    }
    h3 { margin-top: 0; color: #333; }
  `]
})
export class PatientDashboard {}
