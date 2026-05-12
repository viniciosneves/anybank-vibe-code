import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

export type InputType = 'text' | 'email' | 'password';

@Component({
  selector: 'app-input',
  templateUrl: './input.html',
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Input {
  type = input<InputType>('text');
  placeholder = input<string>('');
  inputId = input<string>('');
  name = input<string>('');
  value = model<string>('');
}
