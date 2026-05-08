import { Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout/main-layout';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Login',
    loadComponent: () =>
      import('./features/login/login').then(m => m.Login),
  },
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: 'assistant',
        title: 'Assistant Dashboard',
        loadComponent: () =>
          import('./features/dashboard/assistant-dashboard/assistant-dashboard').then(m => m.AssistantDashboard),
      },
      {
        path: 'doctor',
        title: 'Doctor Dashboard',
        loadComponent: () =>
          import('./features/dashboard/doctor-dashboard/doctor-dashboard').then(m => m.DoctorDashboard),
      },
      {
        path: 'patient',
        title: 'Patient Dashboard',
        loadComponent: () =>
          import('./features/dashboard/patient-dashboard/patient-dashboard').then(m => m.PatientDashboard),
      },
      {
        path: 'radiologist',
        title: 'Radiologist Dashboard',
        loadComponent: () =>
          import('./features/dashboard/radiologist-dashboard/radiologist-dashboard').then(m => m.RadiologistDashboard),
      },
      {
        path: 'dashboard',
        redirectTo: 'assistant', // Default to assistant for now or handle based on role in a guard
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
