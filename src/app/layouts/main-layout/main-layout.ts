import { Component, inject } from '@angular/core';
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

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}
