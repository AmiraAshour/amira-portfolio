import { Component, inject } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { RevealDirective, ParallaxDirective } from '../../shared/animations.directive';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RevealDirective, ParallaxDirective],
  templateUrl: './about.component.html',
})
export class AboutComponent {
  theme = inject(ThemeService);

  stats = [
    { value: 'B.IT', label: 'Minia University', sub: 'June 2026' },
    { value: '3.3', label: 'GPA / 4.0', sub: 'Excellent' },
    { value: 'ECPC', label: 'Finalist', sub: 'Competitive Prog.' },
    { value: '1st', label: 'Minia Camp', sub: 'Phase One' },
  ];
}
