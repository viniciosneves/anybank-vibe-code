import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';
import { Select, SelectOption } from '../../atoms/select/select';

@Component({
  selector: 'app-select-field',
  templateUrl: './select-field.html',
  imports: [Select],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectField {
  label = input.required<string>();
  selectId = input.required<string>();
  name = input<string>('');
  placeholder = input<string>('');
  options = input<SelectOption[]>([]);
  value = model<string>('');
}
