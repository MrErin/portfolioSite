import type { Project } from '@/components/projects/types';

export const projects: Project[] = [
  {
    id: 'unfamiliar',
    name: 'Unfamiliar',
    description: 'AI powered codebase exploration tool with gamified investigation missions',
    techStack: ['Python', 'Langchain/Langgraph', 'Textual'],
    imageUrl: '/projectImages/unfamiliar.webp',
    boringImageUrl: '/projectImages/unfamiliarBoring.webp',
    demoUrl: 'https://pypi.org/project/unfamiliar/',
    repoUrl: 'https://github.com/MrErin/unfamiliar',
  },
  {
    id: 'singlePlayerCoOp',
    name: 'Single Player Co-Op',
    description:
      'A harness for AI-assisted development, providing guardrails, standards, and checkpoints to keep human hands on the wheel.',
    techStack: ['AI Context Engineering'],
    imageUrl: '/projectImages/singlePlayerCoOp.webp',
    boringImageUrl: '/projectImages/singlePlayerCoOpBoring.webp',
    repoUrl: 'https://github.com/MrErin/singlePlayerCoOp',
  },
  {
    id: 'foodMap',
    name: 'Chattanooga Pride Food Map',
    description:
      'An accessibility-focused map of Chattanooga food resources used by local nonprofits to organize efforts and by community members to find resources. Data driven, filterable map with interactive features and companion list of resources outside of the coverage area.',
    techStack: ['TypeScript', 'Leaflet'],
    imageUrl: '/projectImages/foodMap.webp',
    boringImageUrl: '/projectImages/foodMapBoring.webp',
    repoUrl: 'https://github.com/MrErin/prideFoodMap',
    demoUrl: 'https://www.chattanoogapride.com/foodcoalition',
  },
  {
    id: 'annotationExtractor',
    name: 'Kobo Annotation Extractor',
    description:
      'Customized Python script to extract all highlights and annotations from sideloaded Kobo books, format them, and output them to configurable Markdown templates',
    techStack: ['Python', 'Markdown'],
    imageUrl: '/projectImages/annotationExtractor.webp',
    boringImageUrl: '/projectImages/annotationExtractorBoring.webp',
    repoUrl: 'https://github.com/MrErin/annotationExtractor',
  },
  {
    id: 'red-queen-dashboard',
    name: 'Red Queen Dashboard',
    description:
      'A real-time analytics dashboard with live data visualization. Features customizable widgets, dark mode, and export capabilities for reports.',
    techStack: ['React', 'TypeScript', 'D3.js', 'WebSocket'],
    demoUrl: 'https://redqueen.example.com',
    repoUrl: 'https://github.com/user/red-queen-dashboard',
  },
];
