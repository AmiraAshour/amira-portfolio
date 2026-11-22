import { Component, inject } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { EXPERIENCES, EDUCATION, TRAININGS } from '../../data/experience.data';
import { RevealDirective } from '../../shared/animations.directive';

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [RevealDirective],
  templateUrl: './experience.component.html',
})
export class ExperienceComponent {
  theme = inject(ThemeService);
  experiences = EXPERIENCES;
  education = EDUCATION;
  trainings = TRAININGS;
}
