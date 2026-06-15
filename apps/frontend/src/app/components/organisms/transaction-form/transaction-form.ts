import { ChangeDetectionStrategy, Component, output, signal } from '@angular/core';
import { Button } from '../../atoms/button/button';
import { SelectOption } from '../../atoms/select/select';
import { FormField } from '../../molecules/form-field/form-field';
import { SelectField } from '../../molecules/select-field/select-field';

export interface NewTransaction {
  type: string;
  amount: string;
}

@Component({
  selector: 'app-transaction-form',
  templateUrl: './transaction-form.html',
  imports: [Button, FormField, SelectField],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TransactionForm {
  protected readonly type = signal('');
  protected readonly amount = signal('');

  readonly submitted = output<NewTransaction>();

  protected readonly transactionTypes: SelectOption[] = [
    { label: 'Câmbio de moeda', value: 'cambio' },
    { label: 'DOC/TED', value: 'doc-ted' },
    { label: 'Empréstimo e financiamento', value: 'emprestimo' },
    { label: 'Depósito', value: 'deposito' },
  ];

  protected onSubmit(event: Event): void {
    event.preventDefault();
    if (!this.type() || !this.amount()) return;

    this.submitted.emit({ type: this.type(), amount: this.amount() });
  }
}
