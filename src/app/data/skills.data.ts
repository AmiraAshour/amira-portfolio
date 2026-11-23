export interface SkillCategory {
  title: string;
  icon: string;
  skills: string[];
}

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    title: 'Backend Development',
    icon: 'server',
    skills: [
      'C#',
      'ASP.NET Core',
      'ASP.NET Core MVC',
      'RESTful APIs',
      'Entity Framework Core',
      'LINQ',
      'ASP.NET Core Identity',
      'SignalR',
      'Hangfire',

    ],
  },
  {
    title: 'Frontend Development',
    icon: 'layout',
    skills: [
      'Angular',
      'TypeScript',
      'JavaScript',
      'HTML5',
      'CSS3',
      'Tailwind CSS',
    ],
  },
  {
    title: 'Databases',
    icon: 'database',
    skills: ['SQL Server', 'MySQL', 'Oracle', 'Redis'],
  },
  {
    title: 'Architecture & Engineering',
    icon: 'blocks',
    skills: [
      'Clean Architecture',
      'SOLID Principles',
      'Design Patterns',
      'Repository Pattern',
      'Unit of Work',
      'Dependency Injection',
      'REST API Design',
    ],
  },
  {
    title: 'Tools & DevOps',
    icon: 'wrench',
    skills: [
      'Git',
      'GitHub',
      'Docker',
      'Docker Compose',
      'Postman',
      'Swagger',
      'Serilog',
    ],
  },
];
