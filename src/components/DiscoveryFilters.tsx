import { Filter, Zap } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxGroup,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
} from '@/components/ui/combobox';
import { cn } from '@/lib/utils';

interface DiscoveryFiltersProps {
  selectedFilters: string[];
  setSelectedFilters: (val: string[]) => void;
  isLoading: boolean;
  handleScout: () => void;
}
const FILTER_OPTIONS = {
  language: [
    { value: 'language:javascript', label: 'JavaScript' },
    { value: 'language:typescript', label: 'TypeScript' },
    { value: 'language:python', label: 'Python' },
    { value: 'language:go', label: 'Go' },
    { value: 'language:rust', label: 'Rust' },
    { value: 'language:java', label: 'Java' },
    { value: 'language:csharp', label: 'C#' },
    { value: 'language:cpp', label: 'C++' },
    { value: 'language:c', label: 'C' },
    { value: 'language:php', label: 'PHP' },
    { value: 'language:swift', label: 'Swift' },
    { value: 'language:kotlin', label: 'Kotlin' },
    { value: 'language:ruby', label: 'Ruby' },
    { value: 'language:scala', label: 'Scala' },
    { value: 'language:html', label: 'HTML' },
  ],
  stars: [
    { value: 'stars:>100', label: '> 100 Stars' },
    { value: 'stars:>1000', label: '> 1k Stars' },
    { value: 'stars:>5000', label: '> 5k Stars' },
    { value: 'stars:>10000', label: '> 10k Stars' },
    { value: 'stars:>50000', label: '> 50k Stars' },
  ],
  forks: [
    { value: 'forks:>50', label: '> 50 Forks' },
    { value: 'forks:>200', label: '> 200 Forks' },
    { value: 'forks:>1000', label: '> 1k Forks' },
  ],
  label: [
    { value: 'label:good-first-issue', label: 'Good First Issue' },
    { value: 'label:help-wanted', label: 'Help Wanted' },
    { value: 'label:documentation', label: 'Documentation' },
    { value: 'label:bug', label: 'Bug' },
    { value: 'label:enhancement', label: 'Enhancement' },
    { value: 'label:hacktoberfest', label: 'Hacktoberfest' },
    { value: 'label:gsoc', label: 'GSoC' },
  ],
};
export const DiscoveryFilters = ({
  selectedFilters,
  setSelectedFilters,
  isLoading,
  handleScout,
}: DiscoveryFiltersProps) => {
  return (
    <div className="flex items-center gap-6">
      <div className="bg-zinc-100 p-3 rounded-full border border-zinc-200 shadow-sm text-zinc-600 flex-none">
        <Filter size={20} />
      </div>
      <div className="w-full">
        <Combobox
          multiple
          value={selectedFilters}
          onValueChange={(val) => setSelectedFilters(val)}
        >
          <ComboboxChips className="bg-white min-h-[50px] p-2 rounded-sm border-zinc-200 shadow-sm">
            {selectedFilters.map((value) => (
              <ComboboxChip
                key={value}
                value={value}
                className="rounded-md px-2 py-1 bg-zinc-100 text-zinc-900 border-zinc-200"
              >
                {value}
              </ComboboxChip>
            ))}
            <ComboboxChipsInput
              placeholder={
                selectedFilters.length > 0
                  ? ''
                  : 'Filter by Language, Stars, Forks, Labels...'
              }
              className="text-sm ml-1"
            />

            <ComboboxTrigger className="ml-auto mr-2 opacity-50 hover:opacity-100 transition-opacity" />
          </ComboboxChips>

          <ComboboxContent className="top-2.5 rounded-t-none">
            <ComboboxList>
              <ComboboxGroup>
                <ComboboxLabel>Languages</ComboboxLabel>
                {FILTER_OPTIONS.language.map((opt: any) => (
                  <ComboboxItem key={opt.value} value={opt.value}>
                    <span className="flex-1">{opt.label}</span>
                  </ComboboxItem>
                ))}
              </ComboboxGroup>

              <ComboboxSeparator />

              <ComboboxGroup>
                <ComboboxLabel>Stars</ComboboxLabel>
                {FILTER_OPTIONS.stars.map((opt: any) => (
                  <ComboboxItem key={opt.value} value={opt.value}>
                    <span className="flex-1">{opt.label}</span>
                  </ComboboxItem>
                ))}
              </ComboboxGroup>

              <ComboboxSeparator />

              <ComboboxGroup>
                <ComboboxLabel>Forks</ComboboxLabel>
                {FILTER_OPTIONS.forks.map((opt: any) => (
                  <ComboboxItem key={opt.value} value={opt.value}>
                    <span className="flex-1">{opt.label}</span>
                  </ComboboxItem>
                ))}
              </ComboboxGroup>

              <ComboboxSeparator />

              <ComboboxGroup>
                <ComboboxLabel>Labels</ComboboxLabel>
                {FILTER_OPTIONS.label.map((opt: any) => (
                  <ComboboxItem key={opt.value} value={opt.value}>
                    <span className="flex-1">{opt.label}</span>
                  </ComboboxItem>
                ))}
              </ComboboxGroup>
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>

      <Button
        size="sm"
        className="px-8 bg-zinc-900 hover:bg-zinc-800 text-white rounded-sm shadow-lg shadow-zinc-200 font-semibold h-12"
        onClick={handleScout}
        disabled={selectedFilters.length === 0 || isLoading}
      >
        <Zap
          className={cn(
            'mr-2 h-4 w-4 fill-white',
            isLoading && 'animate-pulse'
          )}
        />
        {isLoading ? 'Scouting...' : 'Scout'}
      </Button>
    </div>
  );
};
