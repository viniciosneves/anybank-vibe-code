import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-auth-card',
  templateUrl: './auth-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthCard {
  imageSrc = input.required<string>();
  imageAlt = input<string>('');
}
