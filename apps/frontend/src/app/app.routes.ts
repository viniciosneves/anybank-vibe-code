import { Routes } from '@angular/router';
import { CadastroPage } from './pages/cadastro/cadastro';
import { InicioPage } from './pages/inicio/inicio';
import { LoginPage } from './pages/login/login';
import { authGuard } from './core/auth/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginPage },
  { path: 'cadastro', component: CadastroPage },
  { path: 'inicio', component: InicioPage, canActivate: [authGuard] },
  { path: '**', redirectTo: 'login' },
];
