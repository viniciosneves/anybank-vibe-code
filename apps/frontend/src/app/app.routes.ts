import { Routes } from '@angular/router';
import { CadastroPage } from './pages/cadastro/cadastro';
import { LoginPage } from './pages/login/login';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPage },
  { path: 'cadastro', component: CadastroPage },
  { path: '**', redirectTo: 'login' },
];
