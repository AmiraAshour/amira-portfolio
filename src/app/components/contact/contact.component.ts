import { Component, inject } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { SOCIAL_LINKS, EMAIL } from '../../data/social.data';
import { RevealDirective, MagneticDirective } from '../../shared/animations.directive';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [RevealDirective, MagneticDirective],
  templateUrl: './contact.component.html',
})
export class ContactComponent {
  theme = inject(ThemeService);
  socials = SOCIAL_LINKS;
  email = EMAIL;
}
