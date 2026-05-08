import { Component } from '@angular/core';

@Component({
  selector: 'app-radiologist-dashboard',
  standalone: true,
  template: `
    <div class="dashboard-card">
      <h2>Cereri de Radiografie</h2>
      <p>Gestionează cererile primite de la medici și încarcă rezultatele.</p>
      <div class="table-placeholder">
        <p>Momentan nu există cereri active.</p>
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
    .table-placeholder {
      margin-top: 1.5rem;
      padding: 3rem;
      text-align: center;
      background: #fdf2f8;
      border: 2px dashed #f9a8d4;
      border-radius: 0.75rem;
      color: #9d174d;
    }
  `]
})
export class RadiologistDashboard {}
