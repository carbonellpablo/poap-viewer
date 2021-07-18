import { ParsedEvent } from '../api/useEvents';
import { Token } from '../api/useTokens';

export type Badge = ParsedEvent & Token;

export type AccountBadges = Badge[] | [];

export type Tokens = Token[];

export type Events = ParsedEvent[];

export type Badges = Badge[];
