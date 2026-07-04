export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  imageUrl?: string;
  boringImageUrl?: string;
  demoUrl?: string;
  repoUrl: string;
}
