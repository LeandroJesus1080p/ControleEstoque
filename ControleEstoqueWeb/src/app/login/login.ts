import { Component, signal, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

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

  private router = inject(Router);

  togglePasswordVisibility() {
    this.showPassword.update(v => !v);
  }

  login() {
    if (!this.email || !this.password) return;
    
    this.isLoading.set(true);
    // Simulate API request delay
    setTimeout(() => {
      this.isLoading.set(false);
      this.router.navigate(['/produtos']);
    }, 1500);
  }
}
