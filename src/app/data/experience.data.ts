export interface Achievement {
  title: string;
  description: string;
  icon: string;
  link?: string;
  linkLabel?: string;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    title: 'ECPC Finalist',
    description:
      'Qualified for the Egyptian Collegiate Programming Contest Finalist round.',
    icon: 'trophy',
    link: 'https://drive.google.com/file/d/1iaVGltRK-XD68WUUyQ8we0AomnAoOCGy/view',
    linkLabel: 'View Certificate',
  },
  {
    title: 'Codeforces Specialist',
    description: 'Achieved Specialist rank on Codeforces.',
    icon: 'award',
    link: 'https://codeforces.com/profile/AmiraAshour',
    linkLabel: 'View Profile',
  },
  {
    title: 'First Place – Minia Camp Phase One',
    description:
      'Ranked first in the Minia Camp Phase One Problem Solving Competition.',
    icon: 'medal',
  },
];

export interface Experience {
  title: string;
  company: string;
  type: string;
  project: string;
  period: string;
  highlights: string[];
}

export const EXPERIENCES: Experience[] = [
  {
    title: 'Full Stack .NET Developer',
    company: 'Freelance',
    type: 'Freelance',
    project: 'Laundry Management System',
    period: 'October 2025 – November 2025',
    highlights: [
      'Delivered a complete real-world application',
      'Worked directly with the client',
      'Translated business requirements into software features',
      'Implemented automated billing and WhatsApp notifications',
      'Continued improving the application based on client feedback',
      'Successfully delivered a solution that remains in active use',
    ],
  },
];

export interface Education {
  degree: string;
  institution: string;
  faculty: string;
  period: string;
  gpa: string;
  grade: string;
}

export const EDUCATION: Education = {
  degree: 'Bachelor of Information Technology',
  institution: 'Minia University',
  faculty: 'Faculty of Science',
  period: 'October 2022 – June 2026',
  gpa: '3.3 / 4.0',
  grade: 'Excellent',
};

export interface Training {
  title: string;
  provider: string;
  duration?: string;
  period?: string;
  certLink?: string;
}

export const TRAININGS: Training[] = [
  {
    title: 'Web Development using .NET',
    provider: 'Information Technology Institute (ITI)',
    duration: '60 hrs',
    period: '19 July 2025 – 29 July 2025',
    certLink: 'https://drive.google.com/file/d/1cJrecQhc1zwSPzEbUiolHt9qNks-rAfe/view?usp=drivesdk',
  },
  {
    title: 'ASP.NET Core Course',
    provider: 'Harsha – Udemy',
  },
  {
    title: 'Angular Course',
    provider: 'Maximilian Schwarzmüller – Udemy',
  },
];
