import { withInteractable } from '@tambo-ai/react';
import { z } from 'zod';

import { TamboRepoList } from '../components/TamboRepoList';
import {
  type FetchRepoProps,
  RepoDetailsSchema,
  fetchRepoProps,
  fetchRepos,
} from './github';

const RepoListSchema = z.object({
  repos: z
    .array(RepoDetailsSchema)
    .optional()
    .default([])
    .describe('List of repositories to display'),
  isLoading: z.boolean().optional().describe('Whether the data is loading'),
});

export const tools = [
  {
    name: 'search_repositories',
    description:
      "Search for GitHub repositories using keywords like 'next.js' or 'docker' and qualifiers like `language`, `stars`, `topic`, `pushed`.",
    tool: async (input: FetchRepoProps) => {
      const repos = await fetchRepos(input);
      return { repos };
    },
    inputSchema: fetchRepoProps,
    outputSchema: RepoListSchema,
  },
];

const RepoListInteractableConfig = {
  componentName: 'repo_list_view',
  description:
    'Displays a list of repositories using the repo list got from the search_repositiories tool execution',
  propsSchema: RepoListSchema,
};

export const InteractableRepoList = withInteractable(
  TamboRepoList,
  RepoListInteractableConfig
);

export const components = [
  {
    component: InteractableRepoList,
    description: RepoListInteractableConfig.description,
    name: RepoListInteractableConfig.componentName,
    propsSchema: RepoListInteractableConfig.propsSchema,
  },
];
