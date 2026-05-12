import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export type ButtonVariant = 'primary' | 'outline';
export type ButtonType = 'button' | 'submit' | 'reset';

@Component({
  selector: 'app-button',
  templateUrl: './button.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Button {
  variant = input<ButtonVariant>('primary');
  type = input<ButtonType>('button');
  disabled = input<boolean>(false);

  protected readonly classes = computed(() => {
    const base =
      'inline-flex items-center justify-center rounded-full px-6 py-2 text-base font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-anybank-blue focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    const variants: Record<ButtonVariant, string> = {
      primary: 'bg-anybank-blue text-black hover:bg-sky-300',
      outline:
        'border border-white text-white hover:bg-white/10 bg-transparent',
    };
    return `${base} ${variants[this.variant()]}`;
  });
}
