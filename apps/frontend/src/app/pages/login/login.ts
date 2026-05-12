import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Header } from '../../components/organisms/header/header';
import { LoginCard } from '../../components/organisms/login-card/login-card';

@Component({
  selector: 'app-login-page',
  templateUrl: './login.html',
  imports: [Header, LoginCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPage {}
