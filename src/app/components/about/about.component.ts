import { Component, inject } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-about',
  standalone: true,
  templateUrl: './about.component.html',
})
export class AboutComponent {
  theme = inject(ThemeService);

  highlights = [
    { icon: 'graduation-cap', label: 'B.IT – Minia University', sublabel: 'Graduated June 2026 · GPA 3.3 · Excellent' },
    { icon: 'briefcase', label: 'Freelance Experience', sublabel: 'Delivered a real client application' },
    { icon: 'trophy', label: 'ECPC Finalist', sublabel: 'Competitive programming' },
    { icon: 'trending-up', label: 'Continuous Learner', sublabel: 'Always expanding my skill set' },
  ];
}
