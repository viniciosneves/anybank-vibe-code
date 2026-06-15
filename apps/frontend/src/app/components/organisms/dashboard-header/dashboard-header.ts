import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Avatar } from '../../atoms/avatar/avatar';
import { Logo } from '../../atoms/logo/logo';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './dashboard-header.html',
  imports: [Avatar, Logo],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardHeader {
  userName = input.required<string>();
  readonly logout = output<void>();
}
