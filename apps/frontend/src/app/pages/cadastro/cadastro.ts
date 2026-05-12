import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Header } from '../../components/organisms/header/header';
import { SignupCard } from '../../components/organisms/signup-card/signup-card';

@Component({
  selector: 'app-cadastro-page',
  templateUrl: './cadastro.html',
  imports: [Header, SignupCard],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CadastroPage {}
