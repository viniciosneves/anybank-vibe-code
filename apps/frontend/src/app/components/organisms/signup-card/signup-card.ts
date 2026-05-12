import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Button } from '../../atoms/button/button';
import { Checkbox } from '../../atoms/checkbox/checkbox';
import { FormField } from '../../molecules/form-field/form-field';
import { AuthService } from '../../../core/auth/auth.service';
import { AuthCard } from '../auth-card/auth-card';

@Component({
  selector: 'app-signup-card',
  templateUrl: './signup-card.html',
  imports: [AuthCard, Button, Checkbox, FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignupCard {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly nome = signal('');
  protected readonly email = signal('');
  protected readonly senha = signal('');
  protected readonly aceitouPolitica = signal(false);
  protected readonly loading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  protected onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.aceitouPolitica() || this.loading()) return;

    this.loading.set(true);
    this.errorMessage.set(null);

    this.auth
      .register({
        name: this.nome(),
        email: this.email(),
        password: this.senha(),
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          void this.router.navigateByUrl('/login');
        },
        error: (err: { message: string }) => {
          this.errorMessage.set(err.message);
          this.loading.set(false);
        },
      });
  }
}
