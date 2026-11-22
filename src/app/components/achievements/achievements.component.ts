import { Component, inject } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { ACHIEVEMENTS } from '../../data/experience.data';
import { RevealDirective } from '../../shared/animations.directive';

@Component({
  selector: 'app-achievements',
  standalone: true,
  imports: [RevealDirective],
  templateUrl: './achievements.component.html',
})
export class AchievementsComponent {
  theme = inject(ThemeService);
  achievements = ACHIEVEMENTS;
}
