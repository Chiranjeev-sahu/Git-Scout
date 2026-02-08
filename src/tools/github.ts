import { Octokit } from 'octokit';
import { z } from 'zod';

const octokit = new Octokit({
  auth: import.meta.env.VITE_GITHUB_TOKEN,
});

export const RepoDetailsSchema = z.object({
  fullName: z.string().default('Untitled-Repo'),
  url: z.string().default(''),
  description: z.string().nullish().default(''),
  stars: z.number().default(0),
  forks: z.number().default(0),
  language: z.string().nullish().default('Unknown'),
  topics: z.array(z.string()).default([]),
  openBeginnerIssues: z.number().default(0),
  lastUpdated: z.string().default(new Date().toISOString()),
});

export type RepoDetails = z.infer<typeof RepoDetailsSchema>;

interface RepoSearchItem {
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  topics?: string[];
  updated_at: string;
}

export function buildDiscoveryQuery(query: string, filters: string[]): string {
  let baseParts = [];

  if (query && query.trim()) {
    baseParts.push(query.trim());
  }

  baseParts.push('is:public archived:false');

  const finalFilters = [...baseParts];

  if (filters && filters.length > 0) {
    filters.forEach((filter) => {
      if (filter === 'label:good-first-issue') {
        finalFilters.push('good-first-issues:>0');
      } else if (filter === 'label:help-wanted') {
        finalFilters.push('help-wanted-issues:>0');
      } else if (filter.startsWith('label:')) {
        console.warn(
          `Ignoring unsupported label filter for repo search: ${filter}`
        );
      } else {
        finalFilters.push(filter);
      }
    });
  } else if (!query || !query.trim()) {
    const oneYearAgo = new Date();
    oneYearAgo.setDate(oneYearAgo.getDate() - 365);
    const dateStr = oneYearAgo.toISOString().split('T')[0];
    finalFilters.push(`pushed:>=${dateStr} sort:stars`);
  }

  const finalQuery = finalFilters.join(' ');
  console.log('Generated GitHub Repo Query:', finalQuery);
  return finalQuery;
}

export const fetchRepoProps = z.object({
  query: z
    .string()
    .optional()
    .describe(
      "Main search keywords (e.g., 'next.js', 'docker', 'machine learning')."
    ),
  filters: z
    .array(z.string())
    .optional()
    .default([])
    .describe(
      "A list of GitHub search qualifiers. Examples: 'language:typescript', 'stars:>1000', 'pushed:>2023-01-01'. Combine multiple filters to narrow down results."
    ),
});

export type FetchRepoProps = z.infer<typeof fetchRepoProps>;

export async function fetchRepos(
  input: FetchRepoProps
): Promise<RepoDetails[]> {
  try {
    const query = buildDiscoveryQuery(input.query || '', input.filters || []);

    const { data } = await octokit.rest.search.repos({
      q: query,
      per_page: 20, // Fetch top 20 directly
      sort: query.includes('sort:') ? undefined : 'updated',
    });

    const repos = (data.items as unknown as RepoSearchItem[]).map(
      (item) =>
        ({
          fullName: item.full_name,
          url: item.html_url,
          description: item.description,
          stars: item.stargazers_count,
          forks: item.forks_count,
          language: item.language,
          topics: item.topics || [],
          openBeginnerIssues: 0,
          lastUpdated: item.updated_at,
        }) as RepoDetails
    );

    return repos;
  } catch (error) {
    console.error('Failed to search repositories:', error);
    throw error;
  }
}

export async function fetchRepoLanguages(
  owner: string,
  repo: string
): Promise<Record<string, number>> {
  try {
    const { data } = await octokit.rest.repos.listLanguages({ owner, repo });
    return data;
  } catch (error) {
    console.error(`Failed to fetch languages for ${owner}/${repo}`, error);
    return {};
  }
}

export async function fetchRepoIssues(
  owner: string,
  repo: string
): Promise<any[]> {
  try {
    const { data } = await octokit.rest.issues.listForRepo({
      owner,
      repo,
      state: 'open',
      labels: 'good-first-issue',
      sort: 'created',
      direction: 'desc',
      per_page: 10,
    });

    return data;
  } catch (error) {
    console.error(`Failed to fetch issues for ${owner}/${repo}`, error);
    return [];
  }
}
