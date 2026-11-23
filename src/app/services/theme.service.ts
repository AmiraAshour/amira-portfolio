import { Injectable, signal, PLATFORM_ID, DestroyRef, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private platformId = inject(PLATFORM_ID);
  private destroyRef = inject(DestroyRef);
  private readonly STORAGE_KEY = 'amira-portfolio-theme';

  /** Single source of truth for the theme. Read by every template and by
   *  applyTheme(); never written anywhere except setTheme() below. */
  isDark = signal(true);

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;

    // Read the stored/system preference once and apply it without animation.
    // Components read isDark() on first render, so the initial paint is
    // already correct and there is no cross-fade on load.
    this.isDark.set(this.readInitialTheme());
    this.applyTheme();

    // Follow the OS theme only while the visitor has not chosen one.
    const query = window.matchMedia('(prefers-color-scheme: dark)');
    const onSystemChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem(this.STORAGE_KEY)) return;
      this.setTheme(e.matches, true);
    };
    query.addEventListener?.('change', onSystemChange);
    this.destroyRef.onDestroy(() => query.removeEventListener?.('change', onSystemChange));

    // Safety net: guarantee the class matches the signal if the inlined
    // head script ran before <body> existed (bfcache restores, etc.).
    const onPageShow = () => this.applyTheme();
    window.addEventListener('pageshow', onPageShow);
    this.destroyRef.onDestroy(() => window.removeEventListener('pageshow', onPageShow));
  }

  /** User action: flip the theme. */
  toggle(): void {
    this.setTheme(!this.isDark(), true);
  }

  /** Update signal + DOM together. When animate is true the swap runs
   *  with a .theme-transitioning class so every element uses the same
   *  unified transition timing (300ms ease). */
  private setTheme(dark: boolean, animate: boolean): void {
    this.isDark.set(dark);
    localStorage.setItem(this.STORAGE_KEY, dark ? 'dark' : 'light');

    if (!animate || this.prefersReducedMotion()) {
      this.applyTheme();
      return;
    }

    const body = document.body;

    // Arm unified transitions on every element before the class flips.
    body.classList.add('theme-transitioning');
    this.applyTheme();

    // Disarm after the transition completes (300ms + small buffer).
    setTimeout(() => {
      body.classList.remove('theme-transitioning');
    }, 350);
  }

  /** The only place the theme class is written: one synchronous DOM write. */
  private applyTheme(): void {
    document.body.classList.toggle('light-theme', !this.isDark());
  }

  private readInitialTheme(): boolean {
    const saved = localStorage.getItem(this.STORAGE_KEY);
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }

  private prefersReducedMotion(): boolean {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  }
}