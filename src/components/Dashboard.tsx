import { useEffect, useState } from 'react';

import { TamboProvider } from '@tambo-ai/react';
import { Bot, LayoutTemplate } from 'lucide-react';

import { RepoProvider } from '@/context/RepoContext';
import { cn } from '@/lib/utils';

import { type RepoDetails, fetchRepos } from '../tools/github';
import { components, tools } from '../tools/tambo';
import { DiscoveryFilters } from './DiscoveryFilters';
import { RepoDetailsSheet } from './RepoDetailsSheet';
import { RepoList } from './RepoList';
import { MessageThreadFull } from './tambo/message-thread-full';

const SYSTEM_PROMPT = `
You are Scout, a friendly and helpful guide for finding open-source projects on GitHub.

CRITICAL INSTRUCTIONS:
1. When the user asks to find repositories (e.g., "find react projects", "show me rust repos"), ALWAYS use the 'search_repositories' tool.
2. After the 'search_repositories' tool returns results, you MUST render the 'repo_list_view' component.
3. YOU MUST pass the ENTIRE 'repos' array from the tool output directly to the 'repos' prop of 'repo_list_view'.
   - DO NOT pick, summarize, or filter the repositories manually.
   - DO NOT list them as text or bullet points.
   - ALWAYS use: <repo_list_view repos={tool_result.repos} />
4. Provide a brief, helpful context message before or after the component.
`;
const FEATURED_REPOS: RepoDetails[] = [
  {
    fullName: 'calcom/cal.com',
    url: 'https://github.com/calcom/cal.com',
    description: 'Scheduling infrastructure for absolutely everyone.',
    stars: 32000,
    forks: 7500,
    language: 'TypeScript',
    topics: ['scheduling', 'open-source', 'nextjs'],
    openBeginnerIssues: 12,
    lastUpdated: new Date().toISOString(),
  },
  {
    fullName: 'tldraw/tldraw',
    url: 'https://github.com/tldraw/tldraw',
    description: 'A tiny little drawing app.',
    stars: 35000,
    forks: 1800,
    language: 'TypeScript',
    topics: ['canvas', 'drawing', 'editor'],
    openBeginnerIssues: 8,
    lastUpdated: new Date().toISOString(),
  },
  {
    fullName: 'shadcn-ui/ui',
    url: 'https://github.com/shadcn-ui/ui',
    description:
      'Beautifully designed components that you can copy and paste into your apps. Accessible. Customizable. Open Source.',
    stars: 70000,
    forks: 5200,
    language: 'TypeScript',
    topics: ['react', 'tailwind', 'components'],
    openBeginnerIssues: 0,
    lastUpdated: new Date().toISOString(),
  },
  {
    fullName: 'vercel/next.js',
    url: 'https://github.com/vercel/next.js',
    description: 'The React Framework',
    stars: 125000,
    forks: 26000,
    language: 'TypeScript',
    topics: ['react', 'framework', 'server-side-rendering'],
    openBeginnerIssues: 25,
    lastUpdated: new Date().toISOString(),
  },
  {
    fullName: 'facebook/react',
    url: 'https://github.com/facebook/react',
    description: 'The library for web and native user interfaces.',
    stars: 228000,
    forks: 46000,
    language: 'JavaScript',
    topics: ['javascript', 'library', 'ui'],
    openBeginnerIssues: 40,
    lastUpdated: new Date().toISOString(),
  },
  {
    fullName: 'tailwindlabs/tailwindcss',
    url: 'https://github.com/tailwindlabs/tailwindcss',
    description: 'A utility-first CSS framework for rapid UI development.',
    stars: 84000,
    forks: 4300,
    language: 'TypeScript',
    topics: ['css', 'framework', 'responsive-design'],
    openBeginnerIssues: 5,
    lastUpdated: new Date().toISOString(),
  },
];

export const Dashboard = () => {
  const [activeView, setActiveView] = useState<'normal' | 'tambo'>('normal');

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [repos, setRepos] = useState<RepoDetails[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<RepoDetails | null>(null);

  useEffect(() => {
    console.log('Selected Filters:', selectedFilters);
  }, [selectedFilters]);

  const handleScout = async () => {
    if (selectedFilters.length === 0) return;

    setIsLoading(true);
    setHasSearched(true);
    setRepos([]);

    try {
      const discoveredRepos = await fetchRepos({ filters: selectedFilters });
      setRepos(discoveredRepos);
    } catch (error) {
      console.error('Scout failed:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRepoClick = (repo: RepoDetails) => {
    setSelectedRepo(repo);
  };

  return (
    <RepoProvider onSelectRepo={setSelectedRepo}>
      <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto h-[calc(100vh-140px)] overflow-hidden">
        <div className="flex items-center flex-none gap-4">
          <div className="relative flex bg-zinc-100/80 rounded-lg border border-zinc-200/60 p-1.5">
            <button
              onClick={() => setActiveView('normal')}
              className={cn(
                'relative z-10 px-6 py-2 text-sm font-semibold transition-colors duration-300 rounded-md flex items-center gap-2',
                activeView === 'normal'
                  ? 'bg-white text-black shadow-sm border border-zinc-200/50'
                  : 'text-zinc-500 hover:text-zinc-700'
              )}
            >
              <LayoutTemplate size={16} />
              Normal
            </button>
            <button
              onClick={() => setActiveView('tambo')}
              className={cn(
                'relative z-10 px-6 py-2 text-sm font-semibold transition-colors duration-300 rounded-md flex items-center gap-2',
                activeView === 'tambo'
                  ? 'bg-white text-black shadow-sm border border-zinc-200/50'
                  : 'text-zinc-500 hover:text-zinc-700'
              )}
            >
              <Bot size={16} />
              Tambo
            </button>
          </div>
        </div>

        {activeView === 'normal' ? (
          <DiscoveryFilters
            selectedFilters={selectedFilters}
            setSelectedFilters={setSelectedFilters}
            isLoading={isLoading}
            handleScout={handleScout}
          />
        ) : (
          <div className="flex-1 min-h-0 border-[3px] border-zinc-900 rounded-md shadow-2xl overflow-hidden bg-white">
            <TamboProvider
              apiKey={import.meta.env.VITE_TAMBO_API_KEY}
              initialMessages={[
                {
                  role: 'system',
                  content: [{ type: 'text', text: SYSTEM_PROMPT }],
                },
              ]}
              tools={tools}
              components={components}
            >
              <MessageThreadFull />
            </TamboProvider>
          </div>
        )}

        {activeView === 'normal' && !hasSearched && (
          <div className="flex-1 overflow-y-auto pt-2">
            <div id="trending" className="flex items-center gap-2 mb-6">
              <span className="text-sm font-bold uppercase text-zinc-900">
                Featured Repositories
              </span>
            </div>
            <RepoList
              repos={FEATURED_REPOS}
              isLoading={false}
              onRepoClick={handleRepoClick}
            />
          </div>
        )}

        {activeView === 'normal' && hasSearched && (
          <div className="flex-1 overflow-y-auto pr-2">
            <RepoList
              repos={repos}
              isLoading={isLoading}
              onRepoClick={handleRepoClick}
            />
          </div>
        )}

        <RepoDetailsSheet
          isOpen={!!selectedRepo}
          onClose={() => setSelectedRepo(null)}
          repo={selectedRepo}
        />
      </div>
    </RepoProvider>
  );
};
