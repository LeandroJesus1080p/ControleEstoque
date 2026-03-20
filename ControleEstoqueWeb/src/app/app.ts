import { Component, signal, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ControleEstoqueWeb');
  protected isSidebarOpen = signal(true);
  protected isDarkMode = signal(true);
  protected isLoginPage = signal(false);

  private router = inject(Router);

  constructor() {
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd)
    ).subscribe((e) => {
      this.isLoginPage.set(e.urlAfterRedirects.includes('/login'));
    });

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
      this.isDarkMode.set(false);
      document.documentElement.classList.remove('dark');
    } else {
      this.isDarkMode.set(true);
      document.documentElement.classList.add('dark');
      // Fix localStorage silently if it was empty, ensuring persistence matches the new default
      if (!savedTheme) {
        localStorage.setItem('theme', 'dark');
      }
    }
  }

  toggleSidebar() {
    this.isSidebarOpen.update(v => !v);
  }

  toggleTheme() {
    this.isDarkMode.update(v => {
      const isDark = !v;
      if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      return isDark;
    });
  }
}
