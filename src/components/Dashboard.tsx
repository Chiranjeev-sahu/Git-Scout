import { useState, useEffect } from 'react';
import {
  LayoutTemplate,
  Bot,
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { fetchRepos, type RepoDetails } from '../tools/github';
import { RepoDetailsSheet } from './RepoDetailsSheet';
import { RepoList } from './RepoList';
import { RepoProvider } from '@/context/RepoContext';
import { DiscoveryFilters } from './DiscoveryFilters';
import { TamboProvider } from "@tambo-ai/react";
import { MessageThreadFull } from './tambo/message-thread-full';
import { tools, components } from "../tools/tambo";

const SYSTEM_PROMPT = `
You are Git-Scout, an intelligent assistant for finding GitHub repositories.
Your goal is to help users discover open-source projects to contribute to.

CRITICAL INSTRUCTIONS:
1. When the user asks to find repositories (e.g., "find react projects", "show me rust repos"), ALWAYS use the 'search_repositories' tool.
2. DO NOT list the repositories as text.
3. ALWAYS use the 'repo_list_view' component to display the search results.
4. Be concise and helpful.
`;

export const Dashboard = () => {
  const [activeView, setActiveView] = useState<'normal' | 'tambo'>('normal');

  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [repos, setRepos] = useState<RepoDetails[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState<RepoDetails | null>(null);

  useEffect(() => {
    console.log("Selected Filters:", selectedFilters);
  }, [selectedFilters]);

  const handleScout = async () => {
    if (selectedFilters.length === 0) return;

    setIsLoading(true);
    setHasSearched(true);
    setRepos([]);

    try {
      const discoveredRepos = await fetchRepos(selectedFilters);
      setRepos(discoveredRepos);
    } catch (error) {
      console.error("Scout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRepoClick = (repo: RepoDetails) => {
    setSelectedRepo(repo);
  };

  return (
    <RepoProvider onSelectRepo={setSelectedRepo} >
      <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto min-h-screen pb-20">
        <div className="flex items-center gap-4">
          <div className="relative flex bg-zinc-100/80 rounded-lg border border-zinc-200/60 p-1.5">
            <button
              onClick={() => setActiveView('normal')}
              className={cn(
                "relative z-10 px-6 py-2 text-sm font-semibold transition-colors duration-300 rounded-md flex items-center gap-2",
                activeView === 'normal' ? 'bg-white text-black shadow-sm border border-zinc-200/50' : 'text-zinc-500 hover:text-zinc-700'
              )}
            >
              <LayoutTemplate size={16} />
              Normal
            </button>
            <button
              onClick={() => setActiveView('tambo')}
              className={cn(
                "relative z-10 px-6 py-2 text-sm font-semibold transition-colors duration-300 rounded-md flex items-center gap-2",
                activeView === 'tambo' ? 'bg-white text-black shadow-sm border border-zinc-200/50' : 'text-zinc-500 hover:text-zinc-700'
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
          <TamboProvider
            apiKey={import.meta.env.VITE_TAMBO_API_KEY}
            initialMessages={[{ role: 'system', content: [{ type: 'text', text: SYSTEM_PROMPT }] }]}
            tools={tools}
            components={components}
          >
            <div className="h-screen">
              <MessageThreadFull />
            </div>
          </TamboProvider>
        )}

        {activeView === 'normal' && hasSearched && (
          <RepoList
            repos={repos}
            isLoading={isLoading}
            onRepoClick={handleRepoClick}
          />
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
