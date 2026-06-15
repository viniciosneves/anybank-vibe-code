import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'app-nav-item',
  templateUrl: './nav-item.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NavItem {
  label = input.required<string>();
  href = input<string>('#');
  active = input<boolean>(false);

  protected readonly classes = computed(() => {
    const base = 'text-base transition-colors hover:text-anybank-blue';
    return `${base} ${
      this.active() ? 'font-bold text-anybank-ink' : 'font-medium text-anybank-ink/80'
    }`;
  });
}
