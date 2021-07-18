import { ParsedEvent } from '../api/useEvents';
import { Token } from '../api/useTokens';

export type AccountBadge = ParsedEvent & Token;

export type AccountBadges = AccountBadge[] | [];

export type Tokens = Token[];

export type Events = ParsedEvent[];
