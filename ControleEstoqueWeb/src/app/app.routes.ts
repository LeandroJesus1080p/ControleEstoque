import { Routes } from '@angular/router';
import { Produtos } from './produtos/produtos';
import { Categorias } from './categorias/categorias';
import { Login } from './login/login';
import { authGuard } from './services/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'produtos', component: Produtos, canActivate: [authGuard] },
  { path: 'categorias', component: Categorias, canActivate: [authGuard] }
];
