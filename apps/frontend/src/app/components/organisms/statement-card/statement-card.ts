import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { StatementEntry } from '../../molecules/statement-entry/statement-entry';

export interface StatementItem {
  amount: string;
  date: string;
  negative?: boolean;
}

@Component({
  selector: 'app-statement-card',
  templateUrl: './statement-card.html',
  imports: [StatementEntry],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatementCard {
  month = input.required<string>();
  items = input<StatementItem[]>([]);
}
