import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { DashboardHeader } from '../../components/organisms/dashboard-header/dashboard-header';
import { SidebarNav, NavLink } from '../../components/organisms/sidebar-nav/sidebar-nav';
import { BalanceCard } from '../../components/organisms/balance-card/balance-card';
import {
  TransactionForm,
  NewTransaction,
} from '../../components/organisms/transaction-form/transaction-form';
import {
  StatementCard,
  StatementItem,
} from '../../components/organisms/statement-card/statement-card';

@Component({
  selector: 'app-inicio-page',
  templateUrl: './inicio.html',
  imports: [
    DashboardHeader,
    SidebarNav,
    BalanceCard,
    TransactionForm,
    StatementCard,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InicioPage {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly userName: string;
  protected readonly greetingName: string;
  protected readonly today = this.formatToday();
  protected readonly balance = 'R$ 0,00';

  protected readonly navLinks: NavLink[] = [
    { label: 'Início', href: '#', active: true },
    { label: 'Transferências', href: '#' },
    { label: 'Investimentos', href: '#' },
    { label: 'Outros serviços', href: '#' },
  ];

  protected readonly statement: StatementItem[] = [];

  constructor() {
    const user = this.auth.getUser();
    if (!user) {
      this.router.navigateByUrl('/login');
    }
    this.userName = user?.name ?? '';
    this.greetingName = this.userName.trim().split(/\s+/)[0] ?? '';
  }

  protected onTransaction(transaction: NewTransaction): void {
    console.log('Nova transação', transaction);
  }

  protected onLogout(): void {
    this.auth.logout();
    this.router.navigateByUrl('/login');
  }

  private formatToday(): string {
    const formatted = new Intl.DateTimeFormat('pt-BR', {
      weekday: 'long',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }).format(new Date());
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  }
}
