import { useEffect, useState } from 'react';
import Fuse from 'fuse.js';
import Toolbar from '../../components/Toolbar/Toolbar';
import GroupsContainer from '../../components/GroupsContainer/GroupsContainer';
import './AddressTokens.css';
import {
  AccountBadges,
  AccountBadge,
  FilteredBadges,
  Size,
  ToolbarSettings,
  BadgesToRender,
  Sorting,
  SortedBadges,
  SearchedBadges,
  Filters,
  Location,
  Chain,
  BadgesWithSize,
} from '../../shared/types';

interface Props {
  accountBadges: AccountBadges;
}

const applySize = (size: Size, filteredBadges: FilteredBadges) =>
  filteredBadges.map((badge) => ({ ...badge, size }));

const generateBadgesToRender = (
  toolbarSettings: ToolbarSettings,
  fuse: Fuse<AccountBadge>,
  accountBadges: AccountBadges
): BadgesToRender => {
  const { searchInput, filters, sorting, size } = toolbarSettings;
  const searchResults = search(searchInput, accountBadges, fuse);
  const filteredBadges = applyFilters(searchResults, filters);
  const badgesWithSize = applySize(size, filteredBadges);

  return sortByDate(badgesWithSize, sorting);
};

const sortByDate = (
  badgesWithSize: BadgesWithSize,
  sorting: Sorting
): SortedBadges => {
  if (badgesWithSize.length <= 1) return badgesWithSize;

  const sortedArray: SortedBadges = badgesWithSize.slice();

  if (sorting === 'newest') {
    return sortedArray.sort((a, b) => b.timestampDate - a.timestampDate);
  }

  return sortedArray.sort((a, b) => a.timestampDate - b.timestampDate);
};

const search = (
  searchInput: string,
  accountBadges: AccountBadges,
  fuse: Fuse<AccountBadge>
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

export default function AddressTokens({ accountBadges }: Props): JSX.Element {

  const [badgesToRender, setBadgesToRender] = useState<BadgesToRender>([]);
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
    <div className="AddressTokens">
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
