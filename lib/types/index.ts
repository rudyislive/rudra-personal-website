export interface SocialPost {
  id: string;
  platform: 'twitter' | 'linkedin';
  text: string;
  url: string;
  createdAt: string;
  likes?: number;
  retweets?: number;
  comments?: number;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  results: string[];
  date: string;
  image?: string;
  link?: string;
}

export interface Resume {
  name: string;
  title: string;
  email: string;
  phone?: string;
  location?: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  skills: string[];
}

export interface Experience {
  company: string;
  position: string;
  startDate: string;
  endDate?: string;
  description: string[];
}

export interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate?: string;
}

