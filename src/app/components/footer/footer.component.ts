import { Component, inject } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { SOCIAL_LINKS } from '../../data/social.data';
import { ScrollService } from '../../services/scroll.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  templateUrl: './footer.component.html',
})
export class FooterComponent {
  theme = inject(ThemeService);
  scroll = inject(ScrollService);
  socials = SOCIAL_LINKS.filter(s => s.name !== 'Codeforces');
  currentYear = new Date().getFullYear();
}
