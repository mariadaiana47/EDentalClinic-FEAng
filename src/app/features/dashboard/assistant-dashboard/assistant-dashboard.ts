import { Component } from '@angular/core';

@Component({
  selector: 'app-assistant-dashboard',
  standalone: true,
  template: `
    <div>
      <div class="welcome-banner">
        <h2 class="welcome-title">{{ greeting }}, Asistent!</h2>
        <p class="welcome-sub">Gestionati inregistrarea pacientilor si programarile clinicii.</p>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon"><i class="bi bi-person-plus-fill"></i></div>
          <div class="stat-body">
            <div class="stat-value">—</div>
            <div class="stat-label">Pacienti Noi</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon"><i class="bi bi-calendar3"></i></div>
          <div class="stat-body">
            <div class="stat-value">—</div>
            <div class="stat-label">Programari Azi</div>
          </div>
        </div>
      </div>

      <div class="section-title">Actiuni Administrative</div>
      <div class="actions-grid">
        <a routerLink="/assistant/register-patient" class="action-card">
          <div class="action-icon"><i class="bi bi-person-plus"></i></div>
          <div class="action-label">Inregistrare Pacient</div>
          <div class="action-sub">creeaza cont si dosar</div>
        </a>
        <a routerLink="/assistant/appointments" class="action-card">
          <div class="action-icon"><i class="bi bi-calendar3"></i></div>
          <div class="action-label">Programari Clinica</div>
          <div class="action-sub">vezi toata agenda</div>
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

    .stats-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin-bottom: 1.75rem; max-width: 600px; }
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
    .actions-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
    .action-card {
      background: #fff; border: 1px solid #e5e7eb; border-radius: 0.75rem;
      padding: 1.5rem 1.25rem; text-decoration: none; text-align: center;
      display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
    }
    .action-icon { font-size: 1.75rem; color: #3cbdd4; }
    .action-label { font-weight: 600; color: #1a202c; font-size: 0.9rem; }
    .action-sub { font-size: 0.78rem; color: #9ca3af; }
  `]
})
export class AssistantDashboard {
  get greeting(): string {
    const hour = new Date().getHours();
    return hour >= 18 || hour < 5 ? 'Buna seara' : 'Buna ziua';
  }
}
