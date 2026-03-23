import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html'
})
export class Login {
  email = '';
  password = '';
  showPassword = signal(false);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  private router = inject(Router);
  private authService = inject(AuthService);

  togglePasswordVisibility() {
    this.showPassword.update(v => !v);
  }

  login() {
    if (!this.email || !this.password) return;
    
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/produtos']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set('Falha no login. Verifique suas credenciais e tente novamente.');
        console.error('Login error', err);
      }
    });
  }
}
