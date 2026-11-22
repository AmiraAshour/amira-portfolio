import { Component, inject, signal, HostListener, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { ScrollService } from '../../services/scroll.service';
import { SOCIAL_LINKS } from '../../data/social.data';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  theme = inject(ThemeService);
  scroll = inject(ScrollService);
  private platformId = inject(PLATFORM_ID);
  socials = SOCIAL_LINKS.filter(s => s.name === 'GitHub' || s.name === 'LinkedIn');

  isScrolled = signal(false);
  mobileMenuOpen = signal(false);
  hidden = signal(false);
  private lastScrollY = 0;

  navLinks = [
    { label: 'Home', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Skills', id: 'skills' },
    { label: 'Projects', id: 'projects' },
    { label: 'Experience', id: 'experience' },
    { label: 'Achievements', id: 'achievements' },
    { label: 'Contact', id: 'contact' },
  ];

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.lastScrollY = window.scrollY;
    }
  }

  @HostListener('window:scroll')
  onScroll() {
    const y = window.scrollY;
    this.isScrolled.set(y > 50);
    if (y > 300) {
      this.hidden.set(y > this.lastScrollY);
    } else {
      this.hidden.set(false);
    }
    this.lastScrollY = y;
  }

  navigateTo(id: string) {
    this.scroll.scrollTo(id);
    this.mobileMenuOpen.set(false);
  }

  toggleMobile() {
    this.mobileMenuOpen.update(v => !v);
  }
}
