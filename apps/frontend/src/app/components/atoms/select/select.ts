import { ChangeDetectionStrategy, Component, computed, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface SelectOption {
  label: string;
  value: string;
}

@Component({
  selector: 'app-select',
  templateUrl: './select.html',
  imports: [FormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Select {
  selectId = input<string>('');
  name = input<string>('');
  placeholder = input<string>('');
  options = input<SelectOption[]>([]);
  value = model<string>('');

  protected readonly classes = computed(() => {
    const base =
      'w-full appearance-none rounded-full border border-anybank-ink bg-white px-5 py-3 pr-12 text-base focus:outline-none focus:ring-2 focus:ring-anybank-blue';
    return `${base} ${this.value() ? 'text-anybank-ink' : 'text-anybank-ink/60'}`;
  });
}
