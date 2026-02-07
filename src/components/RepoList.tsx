import type { RepoDetails } from '@/tools/github';

import { RepoCard } from './RepoCard';

interface RepoListProps {
  repos: RepoDetails[];
  isLoading: boolean;
  onRepoClick: (repo: RepoDetails) => void;
}

export const RepoList = ({
  repos = [],
  isLoading,
  onRepoClick,
}: RepoListProps) => {
  if (isLoading) {
    return (
      <div className="text-center py-20 text-zinc-500 animate-pulse mt-8">
        Scanning GitHub for opportunities...
      </div>
    );
  }

  if (!repos || repos.length === 0) {
    return (
      <div className="text-center py-20 text-zinc-500 mt-8">
        No repositories found matching your criteria.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 mt-8">
      {repos.map((repo) => (
        <RepoCard
          key={repo.url}
          repo={repo}
          onClick={() => onRepoClick(repo)}
        />
      ))}
    </div>
  );
};
