import {
  Directive,
  ElementRef,
  Input,
  AfterViewInit,
  OnDestroy,
  PLATFORM_ID,
  inject,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

@Directive({
  selector: '[appReveal]',
  standalone: true,
})
export class RevealDirective implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private el = inject(ElementRef);
  private trigger?: ScrollTrigger;

  @Input() appReveal: 'fade-up' | 'fade-left' | 'fade-right' | 'fade' | 'scale' | 'clip' = 'fade-up';
  @Input() revealDelay = 0;
  @Input() revealDuration = 0.8;
  @Input() revealStagger = 0;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const el = this.el.nativeElement;
    const from: gsap.TweenVars = { opacity: 0 };
    const to: gsap.TweenVars = { opacity: 1, duration: this.revealDuration, delay: this.revealDelay, ease: 'power3.out' };

    switch (this.appReveal) {
      case 'fade-up':
        from['y'] = 40;
        to['y'] = 0;
        break;
      case 'fade-left':
        from['x'] = -40;
        to['x'] = 0;
        break;
      case 'fade-right':
        from['x'] = 40;
        to['x'] = 0;
        break;
      case 'scale':
        from['scale'] = 0.9;
        to['scale'] = 1;
        break;
      case 'clip':
        from['clipPath'] = 'inset(0 100% 0 0)';
        to['clipPath'] = 'inset(0 0% 0 0)';
        break;
      case 'fade':
        break;
    }

    gsap.set(el, from);

    if (this.revealStagger > 0) {
      const children = el.children;
      gsap.set(children, from);
      gsap.to(children, {
        ...to,
        stagger: this.revealStagger,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      });
    } else {
      gsap.to(el, {
        ...to,
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      });
    }
  }

  ngOnDestroy(): void {
    this.trigger?.kill();
  }
}

@Directive({
  selector: '[appParallax]',
  standalone: true,
})
export class ParallaxDirective implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private el = inject(ElementRef);

  @Input() appParallax = 50;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    gsap.to(this.el.nativeElement, {
      y: this.appParallax,
      ease: 'none',
      scrollTrigger: {
        trigger: this.el.nativeElement,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });
  }

  ngOnDestroy(): void {
    ScrollTrigger.getAll().forEach(t => {
      if (t.trigger === this.el.nativeElement) t.kill();
    });
  }
}

@Directive({
  selector: '[appMagnetic]',
  standalone: true,
})
export class MagneticDirective implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);
  private el = inject(ElementRef);

  @Input() appMagnetic = 0.3;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const el = this.el.nativeElement;
    const strength = this.appMagnetic;

    el.addEventListener('mousemove', (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, { x: x * strength, y: y * strength, duration: 0.3, ease: 'power2.out' });
    });

    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    });
  }
}

@Directive({
  selector: '[appTextSplit]',
  standalone: true,
})
export class TextSplitDirective implements AfterViewInit {
  private platformId = inject(PLATFORM_ID);
  private el = inject(ElementRef);

  @Input() appTextSplit: 'chars' | 'words' = 'words';
  @Input() splitDelay = 0;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const el = this.el.nativeElement;
    const text = el.textContent || '';

    if (this.appTextSplit === 'words') {
      const words = text.split(' ');
      el.innerHTML = words.map((w: string) =>
        `<span style="display:inline-block;overflow:hidden;"><span class="split-word" style="display:inline-block;transform:translateY(100%);opacity:0;">${w}</span></span>`
      ).join(' ');

      const wordEls = el.querySelectorAll('.split-word');
      gsap.to(wordEls, {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.04,
        delay: this.splitDelay,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: el,
          start: 'top 85%',
          once: true,
        },
      });
    }
  }
}
