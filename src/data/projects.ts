import type { Project } from '../types/project';

export const projects: Project[] = [
  {
    id: 'cheshire-engine',
    name: 'Cheshire Engine',
    description:
      'A game engine built from scratch featuring a custom physics system and real-time rendering. The engine handles 2D sprite animation with optional 3D perspective effects.',
    techStack: ['Rust', 'WebAssembly', 'WebGL'],
    demoUrl: 'https://cheshire-engine.demo.example.com',
    repoUrl: 'https://github.com/user/cheshire-engine',
  },
  {
    id: 'looking-glass-api',
    name: 'Looking Glass API',
    description:
      'A RESTful API gateway that provides unified access to multiple Wonderland services. Features rate limiting, caching, and comprehensive request logging.',
    techStack: ['TypeScript', 'Node.js', 'Express', 'Redis'],
    repoUrl: 'https://github.com/user/looking-glass-api',
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
  }
];
