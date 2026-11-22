import { Component, inject, signal } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { SKILL_CATEGORIES } from '../../data/skills.data';
import { RevealDirective } from '../../shared/animations.directive';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [RevealDirective],
  templateUrl: './skills.component.html',
})
export class SkillsComponent {
  theme = inject(ThemeService);
  categories = SKILL_CATEGORIES;
  activeCategory = signal(0);

  categoryIcons: Record<string, string> = {
    'server': '⚙',
    'layout': '◫',
    'database': '⬡',
    'blocks': '△',
    'wrench': '⚒',
  };
}
