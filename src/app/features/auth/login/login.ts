import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/service/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  private authService = inject(AuthService);
  private router = inject(Router);

  email = '';
  password = '';

  loading = false;
  errorMessage = '';

  onLogin(): void {
    this.errorMessage = '';
    this.loading = true;

    this.authService.login({
      email: this.email.trim(),
      password: this.password
    }).subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/calculator']);
      },
      error: error => {
        this.loading = false;
        this.errorMessage =
          typeof error.error === 'string'
            ? error.error
            : error.error?.message || 'Invalid email or password. Please try again.';
      }
    });
  }
}