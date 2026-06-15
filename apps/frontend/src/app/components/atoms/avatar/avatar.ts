import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Avatar {
  alt = input<string>('Avatar do usuário');
}
