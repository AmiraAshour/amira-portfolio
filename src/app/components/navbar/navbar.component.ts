import {
  Component,
  inject,
  signal,
  OnInit,
  OnDestroy,
  PLATFORM_ID,
  NgZone,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { ScrollService } from '../../services/scroll.service';
import { SOCIAL_LINKS } from '../../data/social.data';

@Component({
  selector: 'app-navbar',
  standalone: true,
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit, OnDestroy {
  theme = inject(ThemeService);
  scroll = inject(ScrollService);
  private platformId = inject(PLATFORM_ID);
  private zone = inject(NgZone);
  socials = SOCIAL_LINKS.filter(s => s.name === 'GitHub' || s.name === 'LinkedIn');

  isScrolled = signal(false);
  mobileMenuOpen = signal(false);
  hidden = signal(false);
  private lastScrollY = 0;

  private onScroll?: () => void;
  private rafId = 0;
  private queued = false;

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
    if (!isPlatformBrowser(this.platformId)) return;

    this.lastScrollY = window.scrollY;

    // Read scroll position + run the math outside Angular's change detection.
    // Only re-enter the zone when a Signal actually changes.
    this.zone.runOutsideAngular(() => {
      this.onScroll = () => {
        if (this.queued) return;
        this.queued = true;
        this.rafId = requestAnimationFrame(() => {
          this.queued = false;
          this.updateScrollState();
        });
      };
      window.addEventListener('scroll', this.onScroll, { passive: true });
    });
  }

  private updateScrollState(): void {
    const y = window.scrollY;
    const scrolled = y > 50;
    const hidden = y > 300 ? y > this.lastScrollY : false;
    this.lastScrollY = y;

    if (scrolled !== this.isScrolled()) {
      this.zone.run(() => this.isScrolled.set(scrolled));
    }
    if (hidden !== this.hidden()) {
      this.zone.run(() => this.hidden.set(hidden));
    }
  }

  ngOnDestroy(): void {
    if (this.onScroll) {
      window.removeEventListener('scroll', this.onScroll);
    }
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }

  navigateTo(id: string) {
    this.scroll.scrollTo(id);
    this.mobileMenuOpen.set(false);
  }

  toggleMobile() {
    this.mobileMenuOpen.update(v => !v);
  }
}