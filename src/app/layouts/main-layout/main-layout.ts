import { Component, computed, signal } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { Auth } from '../../core/auth';
import { CommonModule } from '@angular/common';

import { ToastComponent } from '../../shared/components/toast/toast.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ToastComponent],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.css']
})
export class MainLayout {
  sidebarOpen = signal(false);

  role: any;
  email: any;
  profilePicture: any;
  firstName: any;
  roleLabel: any;

  constructor(private auth: Auth, private router: Router) {
    this.role = auth.currentRole;
    this.email = auth.currentEmail;
    this.profilePicture = auth.profilePicture;
    this.firstName = computed(() => this.email()?.split('@')[0] ?? '');
    this.roleLabel = computed(() => {
      switch (this.role()) {
        case 'DOCTOR': return 'Portal Medic Stomatolog';
        case 'PATIENT': return 'Dosarul Meu Medical';
        case 'ASSISTANT': return 'Portal Asistent';
        case 'RADIOLOGIST': return 'Portal Radiolog';
        default: return 'EDentalClinic';
      }
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
