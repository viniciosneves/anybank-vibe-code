import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Button } from '../../atoms/button/button';
import { Logo } from '../../atoms/logo/logo';
import { SearchBar } from '../../molecules/search-bar/search-bar';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  imports: [Button, Logo, SearchBar, RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Header {
  protected readonly search = signal('');
}
