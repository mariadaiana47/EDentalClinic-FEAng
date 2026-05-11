import { Component } from '@angular/core';

@Component({
  selector: 'app-assistant-dashboard',
  standalone: true,
  template: `
    <div>
      <div class="welcome-banner mb-4">
        <h2 class="fw-bold mb-1">{{ greeting }}, Asistent!</h2>
        <p class="mb-0 opacity-75">Gestionați înregistrarea pacienților și dosarele clinicii.</p>
      </div>
      <div class="row g-3">
        <div class="col-sm-6 col-lg-3">
          <div class="card stat-card">
            <div class="card-body">
              <div class="stat-icon"><i class="bi bi-person-plus-fill"></i></div>
              <div class="stat-label">Pacienți Înregistrați</div>
              <div class="stat-value">—</div>
            </div>
          </div>
        </div>
        <div class="col-sm-6 col-lg-3">
          <div class="card stat-card">
            <div class="card-body">
              <div class="stat-icon"><i class="bi bi-folder2-open"></i></div>
              <div class="stat-label">Dosare Active</div>
              <div class="stat-value">—</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .welcome-banner { background: linear-gradient(135deg, #0d3d56 0%, #3cbdd4 100%); color: white; padding: 1.75rem 2rem; border-radius: 0.5rem; }
    .stat-card { border-top: 3px solid #3cbdd4; }
    .stat-icon { font-size: 1.5rem; color: #3cbdd4; margin-bottom: 0.5rem; }
    .stat-label { font-size: 0.8rem; font-weight: 700; text-transform: uppercase; color: #9ca3af; letter-spacing: 0.04em; }
    .stat-value { font-size: 1.75rem; font-weight: 700; color: #1a202c; }
  `]
})
export class AssistantDashboard {
  get greeting(): string {
    const hour = new Date().getHours();
    return hour >= 18 || hour < 5 ? 'Bună seara' : 'Bună ziua';
  }
}
