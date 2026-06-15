import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-statement-entry',
  templateUrl: './statement-entry.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatementEntry {
  amount = input.required<string>();
  date = input.required<string>();
  negative = input<boolean>(false);

  protected readonly amountClasses = computed(() =>
    this.negative() ? 'text-red-600' : 'text-anybank-ink',
  );
}
