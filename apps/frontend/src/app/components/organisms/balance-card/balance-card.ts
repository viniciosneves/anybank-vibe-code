import { ChangeDetectionStrategy, Component, input, signal } from '@angular/core';

@Component({
  selector: 'app-balance-card',
  templateUrl: './balance-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BalanceCard {
  date = input.required<string>();
  userName = input.required<string>();
  accountType = input<string>('Conta Corrente');
  balance = input.required<string>();

  protected readonly visible = signal(true);

  protected toggleVisibility(): void {
    this.visible.update((value) => !value);
  }
}
