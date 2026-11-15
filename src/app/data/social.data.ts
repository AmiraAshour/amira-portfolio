export interface SocialLink {
  name: string;
  url: string;
  icon: string;
  label: string;
}

export const SOCIAL_LINKS: SocialLink[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/AmiraAshour',
    icon: 'github',
    label: 'GitHub Profile',
  },
  {
    name: 'LinkedIn',
    url: 'https://www.linkedin.com/in/amira-ashour-0ba733350/',
    icon: 'linkedin',
    label: 'LinkedIn Profile',
  },
  {
    name: 'Email',
    url: 'mailto:amira3shour74@gmail.com',
    icon: 'mail',
    label: 'Send Email',
  },
  {
    name: 'Codeforces',
    url: 'https://codeforces.com/profile/AmiraAshour',
    icon: 'code',
    label: 'Codeforces Profile',
  },
];

export const EMAIL = 'amira3shour74@gmail.com';
export const CV_URL = 'Amira_Ashour_CV.pdf';
