import type { RepoDetails } from '@/tools/github';
import { Circle, GitFork, Star } from 'lucide-react';

interface RepoCardProps {
  repo: RepoDetails;
  onClick: () => void;
}

export const RepoCard = ({ repo, onClick }: RepoCardProps) => {
  return (
    <div
      className="p-6 rounded-sm border border-zinc-200 bg-white hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-bold text-zinc-900 hover:text-blue-600 transition-colors">
            {repo.fullName}
          </h3>
          <p className="text-sm text-zinc-500 mt-1 line-clamp-5">{repo.description}</p>
        </div>
        <div className="flex flex-wrap gap-2 justify-end max-w-[50%]">
          {repo.topics.slice(0, 5).map((topic: string) => (
            <span key={topic} className="px-2 py-0.5 text-xs bg-zinc-100 text-zinc-600 rounded-md whitespace-nowrap">{topic}</span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-6 mt-auto pt-4 text-sm text-zinc-600">
        <div className="flex items-center gap-1.5">
          <Star size={16} className="text-yellow-500 fill-yellow-500" />
          {repo.stars.toLocaleString()}
        </div>
        <div className="flex items-center gap-1.5">
          <GitFork size={16} />
          {repo.forks.toLocaleString()}
        </div>
        {repo.language && (
          <div className="flex items-center gap-1.5">
            <Circle size={10} className="fill-blue-500 text-blue-500" />
            {repo.language}
          </div>
        )}

      </div>
    </div>
  );
};
