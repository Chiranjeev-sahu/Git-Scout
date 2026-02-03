import { z } from "zod";
import { fetchRepos, fetchRepoProps, RepoDetailsSchema } from "./github";
import { TamboRepoList } from "../components/TamboRepoList";
import { withInteractable } from "@tambo-ai/react";

const RepoListSchema = z.object({
  repos: z.array(RepoDetailsSchema).describe("List of repositories to display"),
  isLoading: z.boolean().optional().describe("Whether the data is loading"),
});

export const tools = [
  {
    name: "search_repositories",
    description: "Search for GitHub repositories using repository qualifiers like `language`, `stars`, `topic`, `pushed`. Supports finding beginner-friendly repos via `label:good-first-issue` or `label:help-wanted`.",
    tool: async (input: z.infer<typeof fetchRepoProps>) => {
      const repos = await fetchRepos(input.filters);
      return { repos };
    },
    inputSchema: fetchRepoProps,
    outputSchema: RepoListSchema, 
  },
];


const RepoListInteractableConfig = {
  componentName: "repo_list_view",
  description: "Displays a list of repositories using the repo list got from the search_repositiories tool execution",
  propsSchema: RepoListSchema,
};

export const InteractableRepoList = withInteractable(TamboRepoList, RepoListInteractableConfig);

export const components = [
  {
    component: InteractableRepoList,
    description: RepoListInteractableConfig.description,
    name: RepoListInteractableConfig.componentName,
    propsSchema: RepoListInteractableConfig.propsSchema,
  }
];
