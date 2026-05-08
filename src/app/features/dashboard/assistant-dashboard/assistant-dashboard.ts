import { Component } from '@angular/core';

@Component({
  selector: 'app-assistant-dashboard',
  standalone: true,
  template: `
    <div class="dashboard-card">
      <h2>Bun venit, Asistent!</h2>
      <p>Aici poți gestiona înregistrarea pacienților și dosarele acestora.</p>
      <div class="stats-grid">
        <div class="stat-box">
          <span class="label">Pacienți noi azi</span>
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
      background: #eff6ff;
      padding: 1.5rem;
      border-radius: 0.75rem;
      border: 1px solid #dbeafe;
    }
    .label { font-size: 0.875rem; color: #1e40af; font-weight: 600; }
    .value { display: block; font-size: 2rem; font-weight: 700; color: #1e3a8a; }
  `]
})
export class AssistantDashboard {}
