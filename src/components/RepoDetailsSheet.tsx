import { useEffect, useState } from 'react';
import { X, ExternalLink, Star, GitFork, AlertCircle, Calendar, Loader2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { type RepoDetails, fetchRepoLanguages, fetchRepoIssues } from '../tools/github';

interface RepoDetailsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  repo: RepoDetails | null;
}

export function RepoDetailsSheet({ isOpen, onClose, repo }: RepoDetailsSheetProps) {
  const [languages, setLanguages] = useState<Record<string, number>>({});
  const [issues, setIssues] = useState<any[]>([]);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);

  useEffect(() => {
    if (isOpen && repo) {
      const loadDetails = async () => {
        setIsLoadingDetails(true);
        const [owner, repoName] = repo.fullName.split('/');

        const [langs, repoIssues] = await Promise.all([
          fetchRepoLanguages(owner, repoName),
          fetchRepoIssues(owner, repoName)
        ]);

        setLanguages(langs);
        setIssues(repoIssues);
        setIsLoadingDetails(false);
      };

      loadDetails();
    }
  }, [isOpen, repo]);

  if (!isOpen || !repo) return null;

  // Calculate language percentages
  const totalBytes = Object.values(languages).reduce((a, b) => a + b, 0);
  const languageStats = Object.entries(languages)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5) // Top 5
    .map(([lang, bytes]) => ({
      name: lang,
      percentage: Math.round((bytes / totalBytes) * 100),
      color: getLanguageColor(lang)
    }));

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* 1. BACKDROP (Scrim) */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* 2. THE SHEET (Drawer) */}
      <div className="relative w-full max-w-xl h-full bg-white shadow-2xl border-l border-zinc-200 flex flex-col animate-in slide-in-from-right duration-300">

        {/* HEADER */}
        <div className="p-6 border-b border-zinc-100 flex items-start justify-between bg-zinc-50/50">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-zinc-500 text-sm">Repository</span>
              <Badge variant="outline" className="text-zinc-600 bg-white">Public</Badge>
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 flex items-center gap-2">
              {repo.fullName}
            </h2>
            <p className="text-zinc-500 mt-2 text-sm leading-relaxed">
              {repo.description}
            </p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="shrink-0 text-zinc-400 hover:text-zinc-900">
            <X size={20} />
          </Button>
        </div>

        {/* SCROLLABLE CONTENT */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">

          {/* STATS ROW */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-zinc-700 font-medium">
              <Star size={18} className="fill-amber-400 text-amber-400" />
              {repo.stars.toLocaleString()}
            </div>
            <div className="flex items-center gap-2 text-zinc-700 font-medium">
              <GitFork size={18} className="text-zinc-400" />
              {repo.forks.toLocaleString()}
            </div>
            <div className="ml-auto">
              <Button size="sm" variant="outline" className="gap-2 h-8 text-xs" asChild>
                <a href={repo.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={14} /> View on GitHub
                </a>
              </Button>
            </div>
          </div>

          {isLoadingDetails ? (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-400">
              <Loader2 size={32} className="animate-spin mb-2" />
              <p>Fetching latest data...</p>
            </div>
          ) : (
            <>
              {/* LANGUAGE BAR (Visual) */}
              {languageStats.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-zinc-900 mb-3">Language Breakdown</h3>
                  <div className="h-3 w-full rounded-full overflow-hidden flex bg-zinc-100">
                    {languageStats.map((lang) => (
                      <div
                        key={lang.name}
                        style={{ width: `${lang.percentage}%`, backgroundColor: lang.color }}
                        className="h-full"
                        title={`${lang.name} ${lang.percentage}%`}
                      />
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-4 mt-2 text-xs text-zinc-500">
                    {languageStats.map((lang) => (
                      <span key={lang.name} className="flex items-center gap-1">
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: lang.color }} />
                        {lang.name} {lang.percentage}%
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* ISSUES LIST */}
              <div>
                <h3 className="text-sm font-semibold text-zinc-900 mb-4 flex items-center gap-2">
                  <AlertCircle size={16} />
                  Beginner Friendly Issues
                  <Badge className="ml-2 bg-green-100 text-green-700 hover:bg-green-100 border-green-200">
                    {issues.length} available
                  </Badge>
                </h3>

                {issues.length === 0 ? (
                  <p className="text-zinc-500 text-sm">No recent beginner-friendly issues found.</p>
                ) : (
                  <div className="space-y-3">
                    {issues.map(issue => (
                      <a
                        key={issue.id}
                        href={issue.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block p-4 rounded-xl border border-zinc-200 bg-white hover:border-zinc-300 hover:shadow-sm transition-all cursor-pointer"
                      >
                        <div className="flex justify-between items-start gap-3">
                          <h4 className="font-medium text-zinc-900 group-hover:text-blue-600 transition-colors">
                            {issue.title}
                          </h4>
                          <span className="text-xs font-mono text-zinc-400 whitespace-nowrap">#{issue.number}</span>
                        </div>

                        <div className="flex items-center gap-2 mt-3 flex-wrap">
                          {issue.labels.map((label: any) => (
                            <span
                              key={label.id}
                              className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider bg-zinc-100 text-zinc-600 border border-zinc-200"
                            >
                              {label.name}
                            </span>
                          ))}
                          <div className="ml-auto flex items-center gap-1 text-xs text-zinc-400">
                            <Calendar size={12} /> {new Date(issue.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}

        </div>

        <div className="p-4 border-t border-zinc-100 bg-zinc-50 flex justify-end">
          <Button className="w-full bg-zinc-900" asChild>
            <a href={repo.url} target="_blank" rel="noopener noreferrer">Start Scavenging</a>
          </Button>
        </div>

      </div>
    </div>
  );
}

function getLanguageColor(language: string): string {
  const colors: Record<string, string> = {
    JavaScript: '#f1e05a',
    TypeScript: '#3178c6',
    HTML: '#e34c26',
    CSS: '#563d7c',
    Python: '#3572A5',
    Java: '#b07219',
    Go: '#00ADD8',
    Rust: '#dea584',
  };
  return colors[language] || '#94a3b8';
}
