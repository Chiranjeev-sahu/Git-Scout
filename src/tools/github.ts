import { Octokit } from "octokit";
import { z } from "zod";

const octokit = new Octokit({
  auth: import.meta.env.VITE_GITHUB_TOKEN,
});

export const RepoDetailsSchema = z.object({
  fullName: z.string(),
  url: z.string(),
  description: z.string().nullable(),
  stars: z.number(),
  forks: z.number(),
  language: z.string().nullable(),
  topics: z.array(z.string()),
  openBeginnerIssues: z.number(),
  lastUpdated: z.string(),
});

export type RepoDetails = z.infer<typeof RepoDetailsSchema>;

// Define RepoSearchItem to match GitHub API response structure
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

export function buildDiscoveryQuery(filters: string[]): string {
  let baseQuery = 'is:public archived:false';
  
  // Calculate date for default recent activity filter if needed
  // But let's only apply a default date if NO other filters are present to avoid over-restriction
  // baseQuery += ` pushed:>=${dateStr}`; 
  
  const parts = [baseQuery];

  if (!filters || filters.length === 0) {
     // Default: popular repos with good beginner issues created recently
     const oneYearAgo = new Date();
     oneYearAgo.setDate(oneYearAgo.getDate() - 365);
     const dateStr = oneYearAgo.toISOString().split('T')[0];
     
     return `${baseQuery} pushed:>=${dateStr} sort:stars`;
  }

  filters.forEach(filter => {
       if (filter === 'label:good-first-issue') {
      parts.push('good-first-issues:>0');
    } else if (filter === 'label:help-wanted') {
      parts.push('help-wanted-issues:>0');
    } else if (filter.startsWith('label:')) {
       console.warn(`Ignoring unsupported label filter for repo search: ${filter}`);
    } else {
       parts.push(filter);
    }
  });

  const finalQuery = parts.join(' ');
  console.log("Generated GitHub Repo Query:", finalQuery);
  return finalQuery;
}

export const fetchRepoProps = z.object({
  filters: z.array(z.string()).describe("A list of GitHub search qualifiers. Examples: 'language:typescript', 'stars:>1000', 'pushed:>2023-01-01'. Combine multiple filters to narrow down results.")
});

export async function fetchRepos(filters: string[]): Promise<RepoDetails[]> {
  try {
    const query = buildDiscoveryQuery(filters);

    const { data } = await octokit.rest.search.repos({
        q: query,
        per_page: 20, // Fetch top 20 directly
        sort: query.includes('sort:') ? undefined : 'stars', // Default sort by stars if not specified
    });
    
    // Map search results to RepoDetails
    const repos = (data.items as unknown as RepoSearchItem[]).map((item) => ({
      fullName: item.full_name,
      url: item.html_url,
      description: item.description,
      stars: item.stargazers_count,
      forks: item.forks_count,
      language: item.language,
      topics: item.topics || [],
      openBeginnerIssues: 0, // Search API doesn't give this count directly. We'd need a separate call.
      lastUpdated: item.updated_at,
    } as RepoDetails));

    return repos;

  } catch (error) {
    console.error("Failed to search repositories:", error);
    throw error;
  }
}

export async function fetchRepoLanguages(owner: string, repo: string): Promise<Record<string, number>> {
  try {
    const { data } = await octokit.rest.repos.listLanguages({ owner, repo });
    return data;
  } catch (error) {
    console.error(`Failed to fetch languages for ${owner}/${repo}`, error);
    return {};
  }
}

export async function fetchRepoIssues(owner: string, repo: string): Promise<any[]> {
  try {
    const { data } = await octokit.rest.issues.listForRepo({
      owner,
      repo,
      state: 'open',
      labels: 'good-first-issue',
      sort: 'created',
      direction: 'desc',
      per_page: 10
    });
    
    return data;
  } catch (error) {
    console.error(`Failed to fetch issues for ${owner}/${repo}`, error);
    return [];
  }
}
