export interface Project {
  id: string;
  title: string;
  category: string;
  categoryLabel: string;
  role: string;
  description: string;
  contributions: string[];
  features?: string[];
  technologies: string[];
  githubUrl: string;
  liveUrl?: string;
  highlight?: string;
  isTeamProject?: boolean;
  teamNote?: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'laundry-system',
    title: 'Laundry Management System',
    category: 'freelance',
    categoryLabel: 'Freelance | Real Client Project',
    role: 'Full Stack .NET Developer',
    description:
      'Developed and delivered a real-world Laundry Management System for a client, automating billing operations and customer management.',
    contributions: [
      'Developed the application using ASP.NET Core 8 MVC',
      'Implemented customer management',
      'Built a flexible item-based pricing system that allows administrators to manage and update laundry service prices',
      'Implemented automated invoice generation',
      'Integrated WhatsApp messaging to send customer invoices',
      'Implemented daily and monthly invoice notifications',
      'Used Hangfire for scheduled background jobs',
      'Implemented Admin and Worker role-based access',
      'Added PDF and Excel report exports',
      'Implemented Arabic and English localization',
      'Designed a responsive user interface using Tailwind CSS',
      'Worked directly with the client and implemented business-driven changes until achieving full client satisfaction',
    ],
    technologies: [
      'C#',
      'ASP.NET Core 8 MVC',
      'Entity Framework Core',
      'SQL Server',
      'Hangfire',
      'Tailwind CSS',
      'WhatsApp Integration',
    ],
    githubUrl: '',
    highlight: 'This application is still actively used by the client.',
  },
  {
    id: 'smart-microbus',
    title: 'Smart Microbus – Wasla',
    category: 'graduation',
    categoryLabel: 'Graduation Project | Team Project (6 Members)',
    role: 'Backend Developer',
    description:
      'A smart transportation platform designed to improve microbus transportation through route management, passenger services, and real-time driver and route tracking.',
    contributions: [
      'Developed SignalR Hubs for real-time driver location tracking',
      'Implemented SignalR Groups for passengers to subscribe to specific drivers',
      'Built a location broadcasting service to send real-time updates',
      'Developed driver location tracking APIs',
      'Implemented location validation and caching using MemoryCache',
      'Added a distance threshold to reduce unnecessary location updates',
      'Consumed the existing OSRM routing service to retrieve route information and calculate route details from the driver\'s current location to the destination',
      'Integrated route results with SignalR broadcasting',
      'Implemented JWT claim-based station identification',
      'Added secure station ID extraction from authenticated user claims',
      'Implemented admin user management endpoints',
      'Added filtering, sorting, pagination, and account locking/unlocking operations',
    ],
    technologies: [
      'C#',
      'ASP.NET Core 8',
      'SignalR',
      'SQL Server',
      'Entity Framework Core',
      'JWT',
      'MemoryCache',
      'OSRM',
    ],
    githubUrl: 'https://github.com/AmiraAshour/GraduationProject',
    liveUrl: 'https://smart-microbus.runasp.net/swagger/index.html',
    isTeamProject: true,
    teamNote:
      'Contributions listed are my individual work within a 6-member team. The OSRM routing service was implemented by another team member; I consumed it in my location tracking implementation. Google Maps integration was handled by another team member.',
  },
  {
    id: 'store-api',
    title: 'Store API – E-commerce System',
    category: 'personal',
    categoryLabel: 'Personal Project',
    role: 'Full Stack .NET Developer',
    description:
      'A scalable e-commerce backend built using ASP.NET Core and Clean Architecture.',
    contributions: [],
    features: [
      'Built 45+ REST API endpoints',
      'Product, order, user, and payment management',
      'JWT Authentication with Refresh Tokens',
      'Google Authentication',
      'Role-based Authorization',
      'Entity Framework Core with SQL Server',
      '15+ database entities',
      'Generic Repository and Unit of Work patterns',
      'Redis caching for session and basket management',
      'Stripe payment integration with 100+ test transactions',
      'Pagination and full-text search',
      'Soundex search implementation',
      'Performance optimization',
    ],
    technologies: [
      'C#',
      'ASP.NET Core',
      'Clean Architecture',
      'EF Core',
      'SQL Server',
      'Redis',
      'JWT',
      'Stripe',
    ],
    githubUrl: 'https://github.com/AmiraAshour/Store',
    liveUrl: 'https://my-store.runasp.net/swagger/index.html',
  },
  {
    id: 'connectflow',
    title: 'ConnectFlow – Management System',
    category: 'personal',
    categoryLabel: 'Personal Project',
    role: 'Full Stack .NET Developer',
    description:
      'A full-stack management application developed using ASP.NET Core MVC and Entity Framework Core for managing users and roles.',
    contributions: [],
    features: [
      'Secure authentication and authorization',
      'Admin and User roles',
      'Complete CRUD operations',
      'Clean Architecture',
      'Repository Pattern',
      'Dependency Injection',
      '50+ unit tests using xUnit',
      'Database query optimization',
    ],
    technologies: ['C#', 'ASP.NET Core MVC', 'EF Core', 'SQL Server', 'xUnit'],
    githubUrl: 'https://github.com/AmiraAshour/ConnectFlow',
  },
  {
    id: 'task-manager',
    title: 'Task Manager – Angular Frontend',
    category: 'personal',
    categoryLabel: 'Personal Project',
    role: 'Frontend Developer',
    description:
      'A per-user task management application built with Angular 18 to gain hands-on frontend development experience, using a fully standalone-component architecture.',
    contributions: [],
    features: [
      'Implemented nested, lazy-loaded routing using loadChildren and loadComponent',
      'Built functional route guards using CanMatch and CanDeactivate, alongside resolvers for dynamic data and page titles',
      'Used Angular Signals for reactive state management with LocalStorage persistence',
      'Applied Angular Router component input binding to pass resolved route data directly into components',
      'Developed reusable UI components including shared cards, header, and custom 404 page',
      'Created custom pure and impure Pipes for data transformation',
      'Practiced Reactive Forms, Template-driven Forms, RxJS operators, HttpClient, functional Interceptors, and Deferrable Views',
    ],
    technologies: [
      'Angular 18',
      'TypeScript',
      'Angular Signals',
      'Angular Router',
      'RxJS',
      'LocalStorage',
      'HTML',
      'CSS',
    ],
    githubUrl: 'https://github.com/AmiraAshour/Angular-Projects/tree/main/test-routing',
    liveUrl: 'https://deploy-first-angular-project.web.app/users/u4/tasks',
  },
];
