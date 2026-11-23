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
  private ctx?: gsap.Context;

  @Input() appReveal: 'fade-up' | 'fade-left' | 'fade-right' | 'fade' | 'scale' | 'clip' = 'fade-up';
  @Input() revealDelay = 0;
  @Input() revealDuration = 0.5;
  @Input() revealStagger = 0;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const el = this.el.nativeElement;

    // Component-scoped context: revert() kills every tween + ScrollTrigger
    // created here when the directive is destroyed.
    this.ctx = gsap.context(() => {
      const from: gsap.TweenVars = { opacity: 0 };
      const to: gsap.TweenVars = {
        opacity: 1,
        duration: this.revealDuration,
        delay: this.revealDelay,
        ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 95%', once: true },
      };

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

      if (this.revealStagger > 0) {
        const children = el.children;
        gsap.set(children, from);
        gsap.to(children, { ...to, stagger: this.revealStagger });
      } else {
        gsap.set(el, from);
        gsap.to(el, to);
      }
    }, el);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}

@Directive({
  selector: '[appParallax]',
  standalone: true,
})
export class ParallaxDirective implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private el = inject(ElementRef);
  private ctx?: gsap.Context;

  @Input() appParallax = 50;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const el = this.el.nativeElement;

    this.ctx = gsap.context(() => {
      gsap.to(el, {
        y: this.appParallax,
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 1,
        },
      });
    }, el);
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}

@Directive({
  selector: '[appMagnetic]',
  standalone: true,
})
export class MagneticDirective implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private el = inject(ElementRef<HTMLElement>);

  @Input() appMagnetic = 0.3;

  private moveHandler?: (e: MouseEvent) => void;
  private leaveHandler?: () => void;
  private xTo?: ReturnType<typeof gsap.quickTo>;
  private yTo?: ReturnType<typeof gsap.quickTo>;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const el = this.el.nativeElement;
    const strength = this.appMagnetic;

    // quickTo reuses a single tween instead of creating one per mousemove.
    this.xTo = gsap.quickTo(el, 'x', { duration: 0.3, ease: 'power2.out' });
    this.yTo = gsap.quickTo(el, 'y', { duration: 0.3, ease: 'power2.out' });

    this.moveHandler = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      this.xTo?.((e.clientX - rect.left - rect.width / 2) * strength);
      this.yTo?.((e.clientY - rect.top - rect.height / 2) * strength);
    };

    this.leaveHandler = () => {
      this.xTo?.(0);
      this.yTo?.(0);
    };

    el.addEventListener('mousemove', this.moveHandler);
    el.addEventListener('mouseleave', this.leaveHandler);
  }

  ngOnDestroy(): void {
    const el = this.el.nativeElement;
    if (this.moveHandler) el.removeEventListener('mousemove', this.moveHandler);
    if (this.leaveHandler) el.removeEventListener('mouseleave', this.leaveHandler);
    gsap.killTweensOf(el);
  }
}

@Directive({
  selector: '[appTextSplit]',
  standalone: true,
})
export class TextSplitDirective implements AfterViewInit, OnDestroy {
  private platformId = inject(PLATFORM_ID);
  private el = inject(ElementRef);
  private ctx?: gsap.Context;

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
      el.innerHTML = words
        .map(
          (w: string) =>
            `<span style="display:inline-block;overflow:hidden;"><span class="split-word" style="display:inline-block;transform:translateY(100%);opacity:0;">${w}</span></span>`,
        )
        .join(' ');

      const wordEls = el.querySelectorAll('.split-word');
      this.ctx = gsap.context(() => {
        gsap.to(wordEls, {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.04,
          delay: this.splitDelay,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
        });
      }, el);
    }
  }

  ngOnDestroy(): void {
    this.ctx?.revert();
  }
}