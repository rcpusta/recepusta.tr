export type Service = {
  id: string;
  title: string;
  description: string;
  details: string;
  icon: string;
};

export type Project = {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  image: string;
  technologies: string[];
  category: string;
  year: string;
  results: string[];
  featured: boolean;
};

export type BlogPost = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: "Technology" | "Networking" | "Cyber Security" | "Artificial Intelligence";
  date: string;
  readTime: string;
  image: string;
};

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  company: string;
  quote: string;
};

export type TimelineItem = {
  year: string;
  title: string;
  description: string;
};

export type TechItem = {
  name: string;
  category: string;
};
