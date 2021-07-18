import { useEffect, useState } from 'react';
import Fuse from 'fuse.js';
import Toolbar from '../Toolbar/Toolbar';
import GroupsContainer from '../GroupsContainer/GroupsContainer';
import './DisplayBadges.css';
import { AccountBadges, Badge } from '../../shared/types';

export interface Props {
  accountBadges: AccountBadges;
}

export type BadgesToRender = AccountBadges;
export type SearchedBadges = AccountBadges;
export type FilteredBadges = AccountBadges;
export type SortedBadges = AccountBadges;
export type BadgedToRender = AccountBadges;

export type Size = 'small' | 'large';
export type Sorting = 'newest' | 'oldest';
export type Location = 'all' | 'premises' | 'virtual';
export type Chain = 'all' | 'eth' | 'xdai' | 'none';

export interface ToolbarSettings {
  searchInput: string;
  size: Size;
  filters: Filters;
  sorting: Sorting;
}

export interface Filters {
  chain: Chain;
  location: Location;
}

const generateBadgesToRender = (
  toolbarSettings: ToolbarSettings,
  fuse: Fuse<Badge>,
  accountBadges: AccountBadges
): BadgesToRender => {
  const { searchInput, filters, sorting } = toolbarSettings;
  const searchResults = search(searchInput, accountBadges, fuse);
  const filteredBadges = applyFilters(searchResults, filters);

  return sortByDate(filteredBadges, sorting);
};

const sortByDate = (
  filteredBadges: AccountBadges,
  sorting: Sorting
): SortedBadges => {
  if (filteredBadges.length === 0) return filteredBadges;
  if (filteredBadges.length === 1) return filteredBadges;
  const sortedArray: AccountBadges = filteredBadges.slice();

  if (sorting === 'newest') {
    return sortedArray.sort((a, b) => b.timestampDate - a.timestampDate);
  }

  return sortedArray.sort((a, b) => a.timestampDate - b.timestampDate);
};

const search = (
  searchInput: string,
  accountBadges: AccountBadges,
  fuse: Fuse<Badge>
): SearchedBadges => {
  const searchQuery = searchInput.trim();

  if (searchQuery) {
    const result = fuse.search(searchQuery);

    return result.map((res) => res.item);
  }

  return accountBadges;
};

const applyFilters = (
  searchResults: AccountBadges,
  filters: Filters
): FilteredBadges => {
  if (filters.chain !== 'all' || filters.location !== 'all') {
    return searchResults.filter((badge) => {
      const virtual = filters.location === 'virtual';

      return (
        (badge.chain === filters.chain || filters.chain === 'all') &&
        (badge.virtual_event === virtual || filters.location === 'all')
      );
    });
  }

  return searchResults;
};

export default function DisplayBadges({ accountBadges }: Props): JSX.Element {
  const [badgesToRender, setBadgesToRender] = useState<AccountBadges>([]);
  const defaultSettings: ToolbarSettings = {
    filters: { chain: 'all', location: 'all' },
    searchInput: '',
    size: 'large',
    sorting: 'newest',
  };
  const handleChangeToolbar = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.target.form);
    const formObject = Object.fromEntries(formData.entries());
    const filters: Filters = {
      chain: formObject.chain as Chain,
      location: formObject.location as Location,
    };
    const toolbarSettings: ToolbarSettings = {
      filters,
      searchInput: formObject.searchInput as string,
      size: formObject.size as Size,
      sorting: formObject.sorting as Sorting,
    };

    setBadgesToRender(
      generateBadgesToRender(toolbarSettings, fuse, accountBadges)
    );
  };

  const fuse = new Fuse(accountBadges, {
    keys: ['name', 'description', 'city', 'country', 'year', 'end_date'],
    shouldSort: false,
    threshold: 0.2,
  });

  useEffect(
    () =>
      setBadgesToRender(
        generateBadgesToRender(defaultSettings, fuse, accountBadges)
      ),
    []
  );

  return (
    <div className="DisplayBadges">
      <h2>{`Displaying ${badgesToRender.length} badges from ${accountBadges.length}`}</h2>
      <Toolbar handleChangeToolbar={handleChangeToolbar} />
      {badgesToRender.length > 0 ? (
        <GroupsContainer badgesToRender={badgesToRender} />
      ) : (
        <h2>
          There are no results to display that matches your search and filters
        </h2>
      )}
    </div>
  );
}
