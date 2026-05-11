import { Component, inject, computed } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router } from '@angular/router';
import { Auth } from '../../core/auth';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './main-layout.html',
  styleUrls: ['./main-layout.css']
})
export class MainLayout {
  private auth = inject(Auth);
  private router = inject(Router);

  readonly role = this.auth.currentRole;
  readonly email = this.auth.currentEmail;

  readonly firstName = computed(() => this.email()?.split('@')[0] ?? '');

  readonly roleLabel = computed(() => {
    switch (this.role()) {
      case 'DOCTOR': return 'Portal Medic Stomatolog';
      case 'PATIENT': return 'Dosarul Meu Medical';
      case 'ASSISTANT': return 'Portal Asistent';
      case 'RADIOLOGIST': return 'Portal Radiolog';
      default: return 'EDentalClinic';
    }
  });

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
