import { Component, inject, signal, HostListener } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { ScrollService } from '../../services/scroll.service';
import { SOCIAL_LINKS } from '../../data/social.data';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  theme = inject(ThemeService);
  scroll = inject(ScrollService);
  socials = SOCIAL_LINKS.filter(s => s.name === 'GitHub' || s.name === 'LinkedIn');

  isScrolled = signal(false);
  mobileMenuOpen = signal(false);

  navLinks = [
    { label: 'Home', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Skills', id: 'skills' },
    { label: 'Projects', id: 'projects' },
    { label: 'Experience', id: 'experience' },
    { label: 'Achievements', id: 'achievements' },
    { label: 'Contact', id: 'contact' },
  ];

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled.set(window.scrollY > 20);
  }

  navigateTo(id: string) {
    this.scroll.scrollTo(id);
    this.mobileMenuOpen.set(false);
  }

  toggleMobile() {
    this.mobileMenuOpen.update(v => !v);
  }
}
