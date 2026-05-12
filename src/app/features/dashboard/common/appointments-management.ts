import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Auth } from '../../../core/auth';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-appointments-management',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="appointments-page">
      <div class="page-header">
        <h2 class="page-title">{{ title() }}</h2>
        <p class="page-sub">Gestionati programarile si interactiunea cu pacientii.</p>
      </div>

      <div class="calendar-wrap">

        <div class="cal-header">
          <button class="cal-nav" (click)="prevMonth()"><i class="bi bi-chevron-left"></i></button>
          <span class="cal-month-label">{{ currentMonth() | date:'MMMM yyyy' }}</span>
          <button class="cal-nav" (click)="nextMonth()"><i class="bi bi-chevron-right"></i></button>
        </div>

        <div class="cal-grid">
          <div class="cal-dow" *ngFor="let d of dayNames">{{ d }}</div>
          <div *ngFor="let day of calendarDays()"
               class="cal-day"
               [class.other-month]="!day.isCurrentMonth"
               [class.today]="isToday(day.date)"
               [class.selected]="selectedDay() !== null && isSameDay(day.date, selectedDay()!)"
               [class.has-appts]="day.appointments.length > 0"
               (click)="selectDay(day.date)">
            <span class="cal-num">{{ day.date | date:'d' }}</span>
            <div class="cal-dots" *ngIf="day.appointments.length > 0">
              <span *ngFor="let a of day.appointments.slice(0, 3)"
                    class="cal-dot"
                    [class.dot-confirmed]="a.status === 'CONFIRMED'"
                    [class.dot-completed]="a.status === 'COMPLETED'"
                    [class.dot-pending]="a.status === 'PENDING'">
              </span>
              <span class="cal-more" *ngIf="day.appointments.length > 3">+{{ day.appointments.length - 3 }}</span>
            </div>
          </div>
        </div>

        <!-- Detail panel for selected day -->
        <div *ngIf="selectedDay()" class="day-panel">
          <div class="day-panel-head">
            <i class="bi bi-calendar-event"></i>
            {{ selectedDay() | date:'d MMMM yyyy' }}
            <span class="day-panel-count" *ngIf="selectedDayAppointments().length > 0">
              {{ selectedDayAppointments().length }} programări
            </span>
          </div>
          <div *ngIf="selectedDayAppointments().length === 0" class="day-empty">
            <i class="bi bi-calendar-x"></i> Nicio programare în această zi.
          </div>
          <div *ngFor="let app of selectedDayAppointments()" class="day-row">
            <div class="day-time">{{ app.appointmentTime | date:'HH:mm' }}</div>
            <div class="day-avatar">{{ app.patient?.lastName?.[0] }}{{ app.patient?.firstName?.[0] }}</div>
            <div class="day-info">
              <div class="day-name">{{ app.patient?.lastName }} {{ app.patient?.firstName }}</div>
              <div class="day-reason">{{ app.reason || 'Consult stomatologic' }}</div>
            </div>
            <span class="status-badge" [class]="app.status.toLowerCase()">
              {{ app.status === 'CONFIRMED' ? 'CONFIRMAT' : (app.status === 'COMPLETED' ? 'FINALIZAT' : app.status) }}
            </span>
          </div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .appointments-page { padding: 0; }
    .page-header { margin-bottom: 1.75rem; }
    .header-row { display: flex; align-items: flex-start; justify-content: space-between; gap: 1rem; flex-wrap: wrap; }
    .page-title { font-size: 1.5rem; font-weight: 700; color: #1a202c; margin: 0 0 0.25rem; }
    .page-sub { color: #6b7280; font-size: 0.9rem; margin: 0; }

    .status-badge { font-size: 0.7rem; font-weight: 700; padding: 0.25rem 0.6rem; border-radius: 0.375rem; text-transform: uppercase; }
    .status-badge.pending { background: #f0fbfd; color: #3cbdd4; border: 1px solid #d9f2f7; }
    .status-badge.confirmed { background: #e6f5f9; color: #4bb8d0; border: 1px solid #c7e9f1; }
    .status-badge.completed { background: #f3f4f6; color: #6b7280; }

    /* CALENDAR */
    .calendar-wrap { background: #fff; border: 1px solid #e5e7eb; border-radius: 0.75rem; overflow: hidden; }

    .cal-header {
      display: flex; align-items: center; justify-content: space-between;
      padding: 1rem 1.25rem; border-bottom: 1px solid #f3f4f6;
    }
    .cal-month-label { font-weight: 700; font-size: 1rem; color: #1a202c; text-transform: capitalize; }
    .cal-nav {
      background: none; border: 1px solid #e5e7eb; border-radius: 0.4rem;
      width: 32px; height: 32px; display: flex; align-items: center; justify-content: center;
      cursor: pointer; color: #6b7280; transition: all 0.15s;
    }
    .cal-nav:hover { border-color: #3cbdd4; color: #3cbdd4; }

    .cal-grid {
      display: grid;
      grid-template-columns: repeat(7, 1fr);
      border-left: 1px solid #f3f4f6;
    }
    .cal-dow {
      padding: 0.6rem 0; text-align: center;
      font-size: 0.7rem; font-weight: 700; color: #9ca3af; text-transform: uppercase;
      border-right: 1px solid #f3f4f6; border-bottom: 1px solid #f3f4f6;
      background: #fafafa;
    }
    .cal-day {
      min-height: 80px; padding: 0.5rem; cursor: pointer;
      border-right: 1px solid #f3f4f6; border-bottom: 1px solid #f3f4f6;
      display: flex; flex-direction: column; gap: 0.25rem;
      transition: background 0.12s; position: relative;
    }
    .cal-day:hover { background: #f8fafc; }
    .cal-day.other-month { background: #fafafa; }
    .cal-day.other-month .cal-num { color: #d1d5db; }
    .cal-day.today .cal-num {
      background: #3cbdd4; color: #fff;
      width: 24px; height: 24px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700;
    }
    .cal-day.selected { background: #f0fbfd; }
    .cal-day.selected::after {
      content: ''; position: absolute; inset: 0;
      border: 2px solid #3cbdd4; border-radius: 0; pointer-events: none;
    }

    .cal-num { font-size: 0.82rem; font-weight: 600; color: #374151; line-height: 24px; }
    .cal-dots { display: flex; gap: 3px; flex-wrap: wrap; margin-top: 2px; }
    .cal-dot { width: 7px; height: 7px; border-radius: 50%; }
    .dot-confirmed { background: #3cbdd4; }
    .dot-pending   { background: #fbbf24; }
    .dot-completed { background: #9ca3af; }
    .cal-more { font-size: 0.62rem; color: #9ca3af; font-weight: 600; }

    /* DAY PANEL */
    .day-panel { border-top: 2px solid #e0f7fb; }
    .day-panel-head {
      display: flex; align-items: center; gap: 0.5rem;
      padding: 0.875rem 1.25rem; font-weight: 600; font-size: 0.9rem;
      color: #1a202c; background: #f7fdfe;
      border-bottom: 1px solid #d9f2f7;
      text-transform: capitalize;
    }
    .day-panel-head i { color: #3cbdd4; }
    .day-panel-count { margin-left: auto; font-size: 0.75rem; font-weight: 600; color: #9ca3af; }
    .day-empty {
      padding: 1.5rem; text-align: center; color: #9ca3af;
      font-style: italic; font-size: 0.875rem;
      display: flex; align-items: center; justify-content: center; gap: 0.5rem;
    }
    .day-row {
      display: flex; align-items: center; gap: 0.875rem;
      padding: 0.875rem 1.25rem; border-bottom: 1px solid #f3f4f6;
    }
    .day-row:last-child { border-bottom: none; }
    .day-time { font-size: 0.85rem; font-weight: 700; color: #3cbdd4; width: 40px; flex-shrink: 0; }
    .day-avatar {
      width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0;
      background: #f0fbfd; color: #3cbdd4; border: 1px solid #d9f2f7;
      display: flex; align-items: center; justify-content: center;
      font-weight: 700; font-size: 0.78rem;
    }
    .day-info { flex: 1; min-width: 0; }
    .day-name { font-weight: 600; color: #1a202c; font-size: 0.875rem; }
    .day-reason { font-size: 0.78rem; color: #6b7280; }
  `]
})
export class AppointmentsManagement implements OnInit {
  private http = inject(HttpClient);
  private auth = inject(Auth);

  appointments = signal<any[]>([]);
  role = signal(this.auth.currentRole());
  title = signal(this.auth.currentRole() === 'DOCTOR' ? 'Agenda Mea' : 'Programari Clinica');
  currentMonth = signal(new Date());
  selectedDay = signal<Date | null>(null);

  readonly dayNames = ['Lun', 'Mar', 'Mie', 'Joi', 'Vin', 'Sâm', 'Dum'];

  calendarDays = computed(() => {
    const month = this.currentMonth();
    const year = month.getFullYear();
    const m = month.getMonth();

    const firstDay = new Date(year, m, 1);
    const lastDay = new Date(year, m + 1, 0);

    let startDow = firstDay.getDay();
    startDow = startDow === 0 ? 6 : startDow - 1;

    const days: { date: Date; isCurrentMonth: boolean; appointments: any[] }[] = [];

    for (let i = startDow - 1; i >= 0; i--) {
      const date = new Date(year, m, -i);
      days.push({ date, isCurrentMonth: false, appointments: this.getAppsForDay(date) });
    }
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, m, d);
      days.push({ date, isCurrentMonth: true, appointments: this.getAppsForDay(date) });
    }
    const remaining = 42 - days.length;
    for (let d = 1; d <= remaining; d++) {
      const date = new Date(year, m + 1, d);
      days.push({ date, isCurrentMonth: false, appointments: this.getAppsForDay(date) });
    }
    return days;
  });

  selectedDayAppointments = computed(() => {
    const day = this.selectedDay();
    if (!day) return [];
    return this.appointments().filter(a => this.isSameDay(new Date(a.appointmentTime), day));
  });

  ngOnInit() { this.loadAppointments(); }

  loadAppointments() {
    this.http.get<any[]>(`${environment.apiUrl}/appointments/me`).subscribe(a => this.appointments.set(a));
  }

  updateStatus(id: number, status: string) {
    this.http.patch(`${environment.apiUrl}/appointments/${id}/status?status=${status}`, {}).subscribe(() => this.loadAppointments());
  }

  prevMonth() {
    const d = this.currentMonth();
    this.currentMonth.set(new Date(d.getFullYear(), d.getMonth() - 1, 1));
    this.selectedDay.set(null);
  }

  nextMonth() {
    const d = this.currentMonth();
    this.currentMonth.set(new Date(d.getFullYear(), d.getMonth() + 1, 1));
    this.selectedDay.set(null);
  }

  selectDay(date: Date) {
    const cur = this.selectedDay();
    this.selectedDay.set(cur && this.isSameDay(date, cur) ? null : date);
  }

  isSameDay(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() &&
           a.getMonth() === b.getMonth() &&
           a.getDate() === b.getDate();
  }

  isToday(date: Date): boolean { return this.isSameDay(date, new Date()); }

  getAppsForDay(date: Date): any[] {
    return this.appointments().filter(a => this.isSameDay(new Date(a.appointmentTime), date));
  }
}
