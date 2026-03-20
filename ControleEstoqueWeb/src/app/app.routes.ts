import { Routes } from '@angular/router';
import { Produtos } from './produtos/produtos';
import { Categorias } from './categorias/categorias';
import { Login } from './login/login';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'produtos', component: Produtos },
  { path: 'categorias', component: Categorias }
];
