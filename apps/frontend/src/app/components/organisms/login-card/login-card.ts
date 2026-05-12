import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { Button } from '../../atoms/button/button';
import { Checkbox } from '../../atoms/checkbox/checkbox';
import { FormField } from '../../molecules/form-field/form-field';
import { AuthService } from '../../../core/auth/auth.service';
import { AuthCard } from '../auth-card/auth-card';

@Component({
  selector: 'app-login-card',
  templateUrl: './login-card.html',
  imports: [AuthCard, Button, Checkbox, FormField],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginCard {
  private readonly auth = inject(AuthService);

  protected readonly email = signal('');
  protected readonly senha = signal('');
  protected readonly aceitouPolitica = signal(false);
  protected readonly loading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly success = signal(false);

  protected onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.aceitouPolitica() || this.loading()) return;

    this.loading.set(true);
    this.errorMessage.set(null);

    this.auth
      .login({ email: this.email(), password: this.senha() })
      .subscribe({
        next: (response) => {
          this.auth.saveSession(response);
          this.loading.set(false);
          this.success.set(true);
        },
        error: (err: { message: string }) => {
          this.errorMessage.set(err.message);
          this.loading.set(false);
        },
      });
  }
}
