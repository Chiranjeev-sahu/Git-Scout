import { RepoList } from "./RepoList";
import type { RepoDetails } from "../tools/github";
import { useRepoContext } from "../context/RepoContext";

interface TamboRepoListProps {
  repos: RepoDetails[];
  isLoading?: boolean;
}

export const TamboRepoList = ({ repos, isLoading = false }: TamboRepoListProps) => {
  const { onSelectRepo } = useRepoContext();

  return (
    <RepoList
      repos={repos}
      isLoading={isLoading}
      onRepoClick={onSelectRepo}
    />
  );
};
