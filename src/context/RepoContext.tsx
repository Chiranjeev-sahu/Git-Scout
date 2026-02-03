import { createContext, useContext, type ReactNode } from 'react';
import type { RepoDetails } from '../tools/github';

interface RepoContextType {
  onSelectRepo: (repo: RepoDetails) => void;
}

const RepoContext = createContext<RepoContextType | undefined>(undefined);

export const useRepoContext = () => {
  const context = useContext(RepoContext);
  if (!context) {
    throw new Error('useRepoContext must be used within a RepoProvider');
  }
  return context;
};

interface RepoProviderProps {
  children: ReactNode;
  onSelectRepo: (repo: RepoDetails) => void;
}

export const RepoProvider = ({ children, onSelectRepo }: RepoProviderProps) => {
  return (
    <RepoContext.Provider value={{ onSelectRepo }}>
      {children}
    </RepoContext.Provider>
  );
};
