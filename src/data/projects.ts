import type { Project } from '@/components/projects/types';

export const projects: Project[] = [
  {
    id: 'unfamiliar',
    name: 'Unfamiliar',
    description: 'AI powered codebase exploration tool that runs in the terminal. Privacy-first design analyzes a repository on your local machine and sends analysis data (not raw code) to the LLM you configure. The LLM structures mission chains and themes them, gamifying the process of learning a new codebase. Published on PyPI.',
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
      'Harness for AI-assisted development, providing guardrails, standards, and checkpoints for human/AI collaboration.',
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
    id: 'thisPage',
    name: 'This Page',
    description:
      'This page was SO much fun to put together and also an enormous pain in the ass.',
    techStack: ['React', 'TypeScript', 'Framer Motion', 'Grit'],
    demoUrl: 'https://www.erinmeaker.com',
    repoUrl: 'https://github.com/mrerin',
    imageUrl: '/projectImages/watch.svg'
  },
];
