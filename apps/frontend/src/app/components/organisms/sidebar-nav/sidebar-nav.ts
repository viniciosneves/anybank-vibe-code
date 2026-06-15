import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { NavItem } from '../../molecules/nav-item/nav-item';

export interface NavLink {
  label: string;
  href?: string;
  active?: boolean;
}

@Component({
  selector: 'app-sidebar-nav',
  templateUrl: './sidebar-nav.html',
  imports: [NavItem],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarNav {
  items = input<NavLink[]>([]);
}
