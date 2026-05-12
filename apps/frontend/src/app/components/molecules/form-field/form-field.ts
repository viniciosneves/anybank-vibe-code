import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { Input, InputType } from '../../atoms/input/input';

@Component({
  selector: 'app-form-field',
  templateUrl: './form-field.html',
  imports: [Input],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormField {
  label = input.required<string>();
  inputId = input.required<string>();
  name = input<string>('');
  type = input<InputType>('text');
  placeholder = input<string>('');
  value = model<string>('');
}
