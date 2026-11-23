import {
  AfterViewInit,
  Component,
  ElementRef,
  OnDestroy,
  PLATFORM_ID,
  ViewChild,
  inject,
  signal,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ThemeService } from '../../services/theme.service';
import { ScrollService } from '../../services/scroll.service';
import { SOCIAL_LINKS } from '../../data/social.data';
import { MagneticDirective } from '../../shared/animations.directive';

type TokenType =
  | 'plain'
  | 'keyword'
  | 'type'
  | 'string'
  | 'func'
  | 'number'
  | 'comment'
  | 'punct'
  | 'decorator';

interface Token {
  text: string;
  type: TokenType;
}

interface Snippet {
  lang: string;
  file: string;
  lines: string[];
}

const SNIPPETS: Snippet[] = [
  {
    lang: 'C#',
    file: 'Developer.cs',
    lines: [
      'public class Developer',
      '{',
      '    public string Name => "Amira Ashour";',
      '    public string[] Stack => [".NET", "Angular"];',
      '}',
    ],
  },
  {
    lang: 'TypeScript',
    file: 'portfolio.component.ts',
    lines: [
      '@Component({',
      '  standalone: true,',
      "  selector: 'app-portfolio'",
      '})',
      'export class PortfolioComponent {}',
    ],
  },
  {
    lang: 'C#',
    file: 'ProjectsController.cs',
    lines: [
      '[HttpGet("projects")]',
      'public async Task<IActionResult> GetProjects()',
      '{',
      '    return Ok(await service.GetAllAsync());',
      '}',
    ],
  },
  {
    lang: 'TypeScript',
    file: 'projects.service.ts',
    lines: [
      'const projects = await http.get<Project[]>(',
      "  '/api/projects'",
      ');',
    ],
  },
];

const KEYWORDS = new Set([
  'public', 'private', 'protected', 'class', 'string', 'return', 'new', 'async',
  'await', 'namespace', 'using', 'static', 'void', 'int', 'bool', 'var', 'get',
  'set', 'readonly', 'override', 'virtual', 'this', 'base', 'null', 'true',
  'false', 'import', 'from', 'export', 'const', 'let', 'standalone', 'selector',
  'as', 'of', 'in', 'typeof',
]);

const TYPES = new Set([
  'Developer', 'Project', 'PortfolioComponent', 'IActionResult', 'Task',
  'Component', 'Promise', 'Array',
]);

const TOKEN_RE =
  /(\/\/.*$)|("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(@[A-Za-z_]\w*)|(\b\d+\b)|([A-Za-z_]\w*)|(\s+)|([^\sA-Za-z0-9_])/g;

function tokenize(line: string): Token[] {
  const tokens: Token[] = [];
  let last = 0;
  let match: RegExpExecArray | null;
  TOKEN_RE.lastIndex = 0;
  while ((match = TOKEN_RE.exec(line))) {
    if (match.index > last) {
      tokens.push({ text: line.slice(last, match.index), type: 'plain' });
    }
    const text = match[0];
    let type: TokenType = 'punct';
    if (match[1]) {
      type = 'comment';
    } else if (match[2]) {
      type = 'string';
    } else if (match[3]) {
      type = 'decorator';
    } else if (match[4]) {
      type = 'number';
    } else if (match[5]) {
      if (KEYWORDS.has(text)) {
        type = 'keyword';
      } else if (TYPES.has(text)) {
        type = 'type';
      } else {
        let j = TOKEN_RE.lastIndex;
        while (j < line.length && line[j] === ' ') j++;
        if (line[j] === '(') type = 'func';
        else type = 'plain';
      }
    } else if (match[6]) {
      type = 'plain';
    }
    tokens.push({ text, type });
    last = TOKEN_RE.lastIndex;
  }
  if (last < line.length) {
    tokens.push({ text: line.slice(last), type: 'plain' });
  }
  return tokens;
}

function sliceTokens(tokens: Token[], charCount: number): Token[] {
  const result: Token[] = [];
  let remaining = charCount;
  for (const token of tokens) {
    if (remaining <= 0) break;
    if (token.text.length <= remaining) {
      result.push(token);
      remaining -= token.text.length;
    } else {
      result.push({ text: token.text.slice(0, remaining), type: token.type });
      remaining = 0;
    }
  }
  return result;
}

@Component({
  selector: 'app-hero',
  standalone: true,
  imports: [MagneticDirective],
  templateUrl: './hero.component.html',
})
export class HeroComponent implements AfterViewInit, OnDestroy {
  theme = inject(ThemeService);
  scroll = inject(ScrollService);
  private platformId = inject(PLATFORM_ID);
  private host = inject(ElementRef<HTMLElement>);
  socials = SOCIAL_LINKS;

  readonly roles = [
    'Full Stack Developer',
    'Angular Frontend',
    'ASP.NET Core Developer',
    'Backend Developer',
    'REST API Development',
  ];
  displayedRole = signal('');

  codeDisplay = signal<Token[][]>([]);
  codeCursorLine = signal(-1);
  codeLang = signal('C#');
  codeFile = signal('Developer.cs');

  @ViewChild('orbParallax') orbParallax?: ElementRef<HTMLElement>;

  private roleIdx = 0;
  private roleChar = 0;
  private rolePhase: 'typing' | 'hold' | 'deleting' = 'typing';
  private roleTimer?: number;

  private snippetIdx = 0;
  private snippetLines: Token[][] = [];
  private lineChars: number[] = [];
  private lineIdx = 0;
  private colIdx = 0;
  private phase: 'typing' | 'hold' | 'erasing' = 'typing';
  private codeTimer?: number;

  private reducedMotion = false;
  private paused = false;
  private visible = true;
  private io?: IntersectionObserver;
  private onVisibilityChange?: () => void;
  private rafId = 0;
  private running = false;
  private curX = 0;
  private curY = 0;
  private targetX = 0;
  private targetY = 0;
  private lastPx = 0;
  private lastPy = 0;
  private onPointerMove?: (e: PointerEvent) => void;
  private onPointerLeave?: () => void;

  ngAfterViewInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (this.reducedMotion) {
      this.displayedRole.set(this.roles[0]);
      this.setSnippet(0, true);
    } else {
      this.setSnippet(0, false);
      this.scheduleRole(600);
      this.scheduleCode(500);
      this.setupPointerParallax();
    }

    this.observeVisibility();
  }

  ngOnDestroy(): void {
    if (this.roleTimer) window.clearTimeout(this.roleTimer);
    if (this.codeTimer) window.clearTimeout(this.codeTimer);
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.running = false;
    this.io?.disconnect();
    if (this.onVisibilityChange) {
      document.removeEventListener('visibilitychange', this.onVisibilityChange);
    }
    if (this.onPointerMove) {
      this.host.nativeElement.removeEventListener('pointermove', this.onPointerMove);
    }
    if (this.onPointerLeave) {
      this.host.nativeElement.removeEventListener('pointerleave', this.onPointerLeave);
    }
  }

  /* ── Visibility-based pausing (keeps scrolling cheap) ── */
  private observeVisibility(): void {
    this.onVisibilityChange = () => this.syncAnimationState();
    document.addEventListener('visibilitychange', this.onVisibilityChange);

    if (typeof IntersectionObserver === 'undefined') return;

    this.io = new IntersectionObserver(
      (entries) => {
        this.visible = entries[0]?.isIntersecting ?? true;
        this.syncAnimationState();
      },
      { threshold: 0.01 },
    );
    this.io.observe(this.host.nativeElement);
  }

  private syncAnimationState(): void {
    const shouldRun = this.visible && !document.hidden && !this.reducedMotion;
    if (shouldRun) {
      this.resumeAnimations();
    } else {
      this.pauseAnimations();
    }
  }

  private pauseAnimations(): void {
    if (this.paused) return;
    this.paused = true;
    if (this.roleTimer) {
      window.clearTimeout(this.roleTimer);
      this.roleTimer = undefined;
    }
    if (this.codeTimer) {
      window.clearTimeout(this.codeTimer);
      this.codeTimer = undefined;
    }
    this.host.nativeElement.classList.add('hero-paused');
  }

  private resumeAnimations(): void {
    if (!this.paused) return;
    this.paused = false;
    this.host.nativeElement.classList.remove('hero-paused');
    if (!this.roleTimer) this.scheduleRole(400);
    if (!this.codeTimer) this.scheduleCode(400);
  }

  tokClass(type: TokenType): string {
    return `tok-${type}`;
  }

  /* ── Role typewriter ── */
  private scheduleRole(delay: number): void {
    this.roleTimer = window.setTimeout(() => {
      this.roleTimer = undefined;
      if (this.paused) return;
      this.roleTick();
    }, delay);
  }

  private roleTick(): void {
    const phrase = this.roles[this.roleIdx];
    if (this.rolePhase === 'typing') {
      if (this.roleChar < phrase.length) {
        this.roleChar++;
        this.displayedRole.set(phrase.slice(0, this.roleChar));
        this.scheduleRole(65 + Math.random() * 45);
      } else {
        this.rolePhase = 'hold';
        this.scheduleRole(1600);
      }
    } else if (this.rolePhase === 'hold') {
      this.rolePhase = 'deleting';
      this.scheduleRole(420);
    } else {
      if (this.roleChar > 0) {
        this.roleChar--;
        this.displayedRole.set(phrase.slice(0, this.roleChar));
        this.scheduleRole(32 + Math.random() * 20);
      } else {
        this.roleIdx = (this.roleIdx + 1) % this.roles.length;
        this.rolePhase = 'typing';
        this.scheduleRole(260);
      }
    }
  }

  /* ── Code typing ── */
  private setSnippet(idx: number, full: boolean): void {
    this.snippetIdx = idx;
    this.snippetLines = SNIPPETS[idx].lines.map((line) => tokenize(line));
    this.lineChars = this.snippetLines.map((tokens) =>
      tokens.reduce((sum, token) => sum + token.text.length, 0),
    );
    this.codeLang.set(SNIPPETS[idx].lang);
    this.codeFile.set(SNIPPETS[idx].file);
    this.lineIdx = full ? this.snippetLines.length : 0;
    this.colIdx = 0;
    this.renderCode();
  }

  private scheduleCode(delay: number): void {
    this.codeTimer = window.setTimeout(() => {
      this.codeTimer = undefined;
      if (this.paused) return;
      this.codeTick();
    }, delay);
  }

  private codeTick(): void {
    const lines = this.snippetLines;

    if (this.phase === 'typing') {
      if (this.lineIdx >= lines.length) {
        this.phase = 'hold';
        this.scheduleCode(2200);
        return;
      }
      if (this.colIdx < this.lineChars[this.lineIdx]) {
        this.colIdx++;
        this.renderCode();
        this.scheduleCode(22 + Math.random() * 40);
      } else {
        this.lineIdx++;
        this.colIdx = 0;
        this.renderCode();
        this.scheduleCode(this.lineIdx >= lines.length ? 2200 : 150);
        if (this.lineIdx >= lines.length) this.phase = 'hold';
      }
    } else if (this.phase === 'hold') {
      this.phase = 'erasing';
      this.lineIdx = lines.length - 1;
      this.colIdx = this.lineChars[this.lineIdx] ?? 0;
      this.scheduleCode(320);
    } else {
      if (this.lineIdx < 0) {
        const next = (this.snippetIdx + 1) % SNIPPETS.length;
        this.setSnippet(next, false);
        this.phase = 'typing';
        this.scheduleCode(420);
        return;
      }
      if (this.colIdx > 0) {
        this.colIdx--;
        this.renderCode();
        this.scheduleCode(12 + Math.random() * 10);
      } else {
        this.lineIdx--;
        if (this.lineIdx >= 0) this.colIdx = this.lineChars[this.lineIdx] ?? 0;
        this.renderCode();
        this.scheduleCode(14);
      }
    }
  }

  private renderCode(): void {
    const lines = this.snippetLines;
    const out: Token[][] = [];
    for (let i = 0; i < lines.length; i++) {
      let visibleChars: number;
      if (this.lineIdx >= lines.length || i < this.lineIdx) {
        visibleChars = this.lineChars[i];
      } else if (i === this.lineIdx) {
        visibleChars = this.colIdx;
      } else {
        visibleChars = 0;
      }
      out.push(sliceTokens(lines[i], visibleChars));
    }
    this.codeDisplay.set(out);

    let cursor: number;
    if (this.lineIdx < 0) cursor = -1;
    else if (this.lineIdx >= lines.length) cursor = lines.length - 1;
    else cursor = this.lineIdx;
    this.codeCursorLine.set(cursor);
  }

  /* ── Pointer parallax (desktop only, on-demand rAF) ── */
  private setupPointerParallax(): void {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    this.onPointerMove = (e: PointerEvent) => {
      const rect = this.host.nativeElement.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      this.targetX = (e.clientX - rect.left) / rect.width - 0.5;
      this.targetY = (e.clientY - rect.top) / rect.height - 0.5;
      this.startParallax();
    };

    this.onPointerLeave = () => {
      this.targetX = 0;
      this.targetY = 0;
      this.startParallax();
    };

    this.host.nativeElement.addEventListener('pointermove', this.onPointerMove, { passive: true });
    this.host.nativeElement.addEventListener('pointerleave', this.onPointerLeave, { passive: true });
  }

  private startParallax(): void {
    if (this.running) return;
    this.running = true;
    this.rafId = requestAnimationFrame(this.tickPointer);
  }

  private tickPointer = (): void => {
    const dx = this.targetX - this.curX;
    const dy = this.targetY - this.curY;

    this.curX += dx * 0.1;
    this.curY += dy * 0.1;

    const px = Math.round(this.curX * 2200) / 100;
    const py = Math.round(this.curY * 2200) / 100;
    if (px !== this.lastPx || py !== this.lastPy) {
      const el = this.orbParallax?.nativeElement;
      if (el) {
        el.style.setProperty('--px', px + 'px');
        el.style.setProperty('--py', py + 'px');
        this.lastPx = px;
        this.lastPy = py;
      }
    }

    // Stop the loop once the easing has effectively settled.
    if (Math.abs(dx) < 0.001 && Math.abs(dy) < 0.001) {
      this.curX = this.targetX;
      this.curY = this.targetY;
      this.running = false;
      this.rafId = 0;
      return;
    }

    this.rafId = requestAnimationFrame(this.tickPointer);
  };
}