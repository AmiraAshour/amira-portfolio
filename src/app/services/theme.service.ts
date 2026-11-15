import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private readonly STORAGE_KEY = 'amira-portfolio-theme';

  isDark = signal(true);

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) {
        this.isDark.set(saved === 'dark');
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        this.isDark.set(prefersDark);
      }
      this.applyTheme();
    }

    effect(() => {
      if (isPlatformBrowser(this.platformId)) {
        const dark = this.isDark();
        localStorage.setItem(this.STORAGE_KEY, dark ? 'dark' : 'light');
        this.applyTheme();
      }
    });
  }

  toggle(): void {
    this.isDark.update((v) => !v);
  }

  private applyTheme(): void {
    const body = document.body;
    if (this.isDark()) {
      body.classList.remove('light-theme');
    } else {
      body.classList.add('light-theme');
    }
  }
}
