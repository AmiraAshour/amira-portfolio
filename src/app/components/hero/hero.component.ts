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
  private rafId = 0;
  private curX = 0;
  private curY = 0;
  private targetX = 0;
  private targetY = 0;
  private onPointerMove?: (e: PointerEvent) => void;

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
  }

  ngOnDestroy(): void {
    if (this.roleTimer) window.clearTimeout(this.roleTimer);
    if (this.codeTimer) window.clearTimeout(this.codeTimer);
    if (this.rafId) cancelAnimationFrame(this.rafId);
    if (this.onPointerMove) {
      this.host.nativeElement.removeEventListener('pointermove', this.onPointerMove);
    }
  }

  tokClass(type: TokenType): string {
    return `tok-${type}`;
  }

  /* ── Role typewriter ── */
  private scheduleRole(delay: number): void {
    this.roleTimer = window.setTimeout(() => this.roleTick(), delay);
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
    this.codeTimer = window.setTimeout(() => this.codeTick(), delay);
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

  /* ── Pointer parallax (desktop only) ── */
  private setupPointerParallax(): void {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

    this.onPointerMove = (e: PointerEvent) => {
      const rect = this.host.nativeElement.getBoundingClientRect();
      this.targetX = (e.clientX - rect.left) / rect.width - 0.5;
      this.targetY = (e.clientY - rect.top) / rect.height - 0.5;
    };
    this.host.nativeElement.addEventListener('pointermove', this.onPointerMove, {
      passive: true,
    });
    this.rafId = requestAnimationFrame(this.tickPointer);
  }

  private tickPointer = (): void => {
    this.curX += (this.targetX - this.curX) * 0.08;
    this.curY += (this.targetY - this.curY) * 0.08;
    const orb = this.orbParallax?.nativeElement;
    if (orb) {
      orb.style.setProperty('--px', `${(this.curX * 22).toFixed(2)}px`);
      orb.style.setProperty('--py', `${(this.curY * 22).toFixed(2)}px`);
    }
    this.rafId = requestAnimationFrame(this.tickPointer);
  };
}