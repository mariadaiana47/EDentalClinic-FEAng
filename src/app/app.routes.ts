import { Routes } from '@angular/router';
import { MainLayout } from './layouts/main-layout/main-layout';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: 'login',
    title: 'Login',
    loadComponent: () => import('./features/login/login').then(m => m.Login),
  },
  {
    path: 'change-password',
    title: 'Schimbare Parolă',
    canActivate: [authGuard],
    loadComponent: () => import('./features/auth/change-password/change-password').then(m => m.ChangePassword),
  },
  {
    path: '',
    component: MainLayout,
    canActivate: [authGuard],
    children: [
      {
        path: 'assistant',
        canActivate: [roleGuard],
        data: { roles: ['ASSISTANT'] },
        children: [
          {
            path: '',
            loadComponent: () => import('./features/dashboard/assistant-dashboard/assistant-dashboard').then(m => m.AssistantDashboard),
          },
          {
            path: 'register-patient',
            loadComponent: () => import('./features/assistant/patient-registration/patient-registration').then(m => m.PatientRegistration),
          }
        ]
      },
      {
        path: 'doctor',
        canActivate: [roleGuard],
        data: { roles: ['DOCTOR'] },
        children: [
          {
            path: '',
            title: 'Doctor Dashboard',
            loadComponent: () => import('./features/dashboard/doctor-dashboard/doctor-dashboard').then(m => m.DoctorDashboard),
          },
          {
            path: 'search',
            title: 'Căutare Pacient',
            loadComponent: () => import('./features/doctor/patient-list/patient-list').then(m => m.PatientList),
          },
          {
            path: 'patients',
            title: 'Pacienții Mei',
            loadComponent: () => import('./features/doctor/patient-list/patient-list').then(m => m.PatientList),
          },
          {
            path: 'patient/:id',
            title: 'Dosar Pacient',
            loadComponent: () => import('./features/doctor/patient-details/patient-details').then(m => m.PatientDetails),
          },
          {
            path: 'patient/:id/add-clinical-exam',
            title: 'Adăugare Examen Clinic',
            loadComponent: () => import('./features/doctor/add-clinical-exam/add-clinical-exam').then(m => m.AddClinicalExam),
          },
          {
            path: 'radiologists',
            title: 'Radiologi Afiliați',
            loadComponent: () => import('./features/doctor/radiologist-management/radiologist-management').then(m => m.RadiologistManagement),
          }
        ]
      },
      {
        path: 'patient',
        canActivate: [roleGuard],
        data: { roles: ['PATIENT'] },
        children: [
          {
            path: '',
            loadComponent: () => import('./features/dashboard/patient-dashboard/patient-dashboard').then(m => m.PatientDashboard),
          },
          {
            path: 'scheduling',
            title: 'Programare Radiografie',
            loadComponent: () => import('./features/dashboard/patient-dashboard/xray-scheduling').then(m => m.XRayScheduling),
          }
        ]
      },
      {
        path: 'radiologist',
        canActivate: [roleGuard],
        data: { roles: ['RADIOLOGIST'] },
        loadComponent: () => import('./features/dashboard/radiologist-dashboard/radiologist-dashboard').then(m => m.RadiologistDashboard),
      },
      {
        path: 'dashboard',
        redirectTo: 'assistant',
        pathMatch: 'full'
      },
      {
        path: '',
        redirectTo: 'assistant',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];
