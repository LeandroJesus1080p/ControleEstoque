import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private readonly TOKEN_KEY = 'jwt_token';
  private readonly API_URL = 'http://localhost:5211/api/auth/login';

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(this.API_URL, credentials).pipe(
      tap(response => {
        // Assumindo que a API retorna um objeto com o token. Verifique no console se for diferente.
        const token = response.token || response.accessToken || (typeof response === 'string' ? response : null);
        if (token) {
          this.setToken(token);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    this.router.navigate(['/login']);
  }

  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;
    
    // Verifica se o token expirou
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiry = payload.exp;
      if (expiry && (Math.floor((new Date).getTime() / 1000)) >= expiry) {
        this.logout();
        return false;
      }
      return true;
    } catch (e) {
      return false;
    }
  }
}
