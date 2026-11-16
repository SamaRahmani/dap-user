import { Component, HostListener, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { API_CONFIG } from '../../core/config/api.config';
import { AuthService } from '../../core/service/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar {
  private readonly router = inject(Router);

  readonly authService = inject(AuthService);
  readonly menuOpen = signal(false);
  readonly adminPortalUrl = API_CONFIG.adminPortalUrl;

  @HostListener('window:resize')
  closeMenuOnResize() {
    if (window.innerWidth >= 768) {
      this.menuOpen.set(false);
    }
  }

  closeMenu() {
    this.menuOpen.set(false);
  }

  toggleMenu() {
    this.menuOpen.update(value => !value);
  }

  logout() {
    this.closeMenu();

    this.authService.logout().subscribe({
      next: () => {
        this.authService.clearSession();
        this.router.navigate(['/']);
      },
      error: () => {
        this.authService.clearSession();
        this.router.navigate(['/']);
      }
    });
  }
}