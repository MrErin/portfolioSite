import type { Project } from '@/features/projects/types.ts';

export const projects: Project[] = [
  {
    id: 'unfamiliar',
    name: 'Unfamiliar',
    description: 'AI powered codebase exploration tool with gamified investigation missions',
    techStack: ['Python', 'Langchain/Langgraph', 'Textual'],
    demoUrl: 'https://pypi.org/project/unfamiliar/',
    repoUrl: 'https://github.com/MrErin/unfamiliar',
  },
  {
    id: 'singlePlayerCoOp',
    name: 'Single Player Co-Op',
    description:
      'A harness for AI-assisted development, providing guardrails, standards, and checkpoints to keep human hands on the wheel.',
    techStack: ['AI Context Engineering'],
    repoUrl: 'https://github.com/MrErin/singlePlayerCoOp',
  },
  {
    id: 'caterpillar-cli',
    name: 'Caterpillar CLI',
    description:
      'A command-line interface tool for automated deployment and environment management. Transforms complex infrastructure tasks into simple, intuitive commands.',
    techStack: ['Go', 'Cobra', 'Docker API'],
    demoUrl: 'https://caterpillar.dev.example.com',
    repoUrl: 'https://github.com/user/caterpillar-cli',
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
