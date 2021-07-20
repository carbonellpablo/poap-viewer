import { ParsedEvent } from '../api/useEvents';
import { Token } from '../api/useTokens';
// api
export type Tokens = Token[];
export type Events = ParsedEvent[];

// displayBadges
export type AccountBadge = ParsedEvent & Token;
export type AccountBadges = AccountBadge[] | [];
export type SearchedBadges = AccountBadges;
export type FilteredBadges = AccountBadges;

export interface BadgeWithSize extends AccountBadge {
  size: Size;
}
export type BadgesWithSize = BadgeWithSize[];
export type BadgesToRender = BadgesWithSize;
export type SortedBadges = BadgesToRender;
export interface IBadgeGroup {
  title: string;
  badges: BadgesToRender;
}

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

export interface BadgeGroups {
  [k: string]: IBadgeGroup;
}
