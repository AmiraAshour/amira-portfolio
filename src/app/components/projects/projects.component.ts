import { Component, inject, signal } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { PROJECTS, Project } from '../../data/projects.data';
import { RevealDirective } from '../../shared/animations.directive';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [RevealDirective],
  templateUrl: './projects.component.html',
})
export class ProjectsComponent {
  theme = inject(ThemeService);
  projects = PROJECTS;
  expandedProject = signal<string | null>(null);
  activeFilter = signal('all');

  filters = [
    { label: 'All', value: 'all' },
    { label: 'Freelance', value: 'freelance' },
    { label: 'Graduation', value: 'graduation' },
    { label: 'Personal', value: 'personal' },
  ];

  get filteredProjects(): Project[] {
    if (this.activeFilter() === 'all') return this.projects;
    return this.projects.filter(p => p.category === this.activeFilter());
  }

  toggleProject(id: string) {
    this.expandedProject.update(v => v === id ? null : id);
  }

  getCategoryColor(category: string): string {
    const dark = this.theme.isDark();
    switch (category) {
      case 'freelance': return dark ? 'text-[#C7F36B] bg-[#C7F36B]/10 border-[#C7F36B]/20' : 'text-[#4D7A0A] bg-[#4D7A0A]/10 border-[#4D7A0A]/20';
      case 'graduation': return dark ? 'text-sky-400 bg-sky-400/10 border-sky-400/20' : 'text-sky-600 bg-sky-600/10 border-sky-600/20';
      default: return dark ? 'text-violet-400 bg-violet-400/10 border-violet-400/20' : 'text-violet-600 bg-violet-600/10 border-violet-600/20';
    }
  }
}
