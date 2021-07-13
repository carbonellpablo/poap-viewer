import { useState, useCallback } from 'react';
import api from './api.constants';

export interface ApiGraphResponse {
  account: { tokens: ApiToken[] };
}

export interface ApiToken {
  event: {
    id: number;
  };
  id: number;
}

export interface Token {
  tokenID: number;
  eventID: number;
  chain: 'eth' | 'xdai';
}

export type Tokens = Token[];
export type GetTokensCallback = () => void;

export interface TokensState {
  alreadyFetched: boolean;
  error: boolean;
  data: Tokens | [];
}

export interface TokensHook {
  tokens: TokensState;
  getTokens: GetTokensCallback;
}


function parseTokens(
  chain: 'eth' | 'xdai',
  apiTokens: ApiGraphResponse
): Tokens | [] {
  if (!apiTokens?.account) return [];
  const parsedTokens: Tokens = [];

  apiTokens.account.tokens.forEach((apiToken: ApiToken) => {
    const tokenID = apiToken.id;
    const eventID = apiToken.event.id;

    parsedTokens.push({ chain, tokenID, eventID });
  });

  return parsedTokens;
}

async function fetchGraphQL(
  endpoint: string,
  address: string
): Promise<ApiGraphResponse> {
  const query = `{account(id:"${address}"){tokens(first:1000){id,event{id,tokenCount}}}}`;
  const params = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({ query }),
  };

  const response: Response = await fetch(endpoint, params);
  const jsonResponse = await response.json();

  if (!response.ok || jsonResponse?.errors) {
    throw new Error(jsonResponse);
  }

  return jsonResponse.data;
}

const useTokens = (address: string): TokensHook => {
  const [tokens, setTokens] = useState<TokensState>({
    alreadyFetched: false,
    error: false,
    data: [],
  });

  const execute = async () => {
    try {
      const ethResponse = await fetchGraphQL(api.graphql.eth, address);
      const xdaiResponse = await fetchGraphQL(api.graphql.eth, address);
      const ethTokens = parseTokens('eth', ethResponse);
      const xdaiTokens = parseTokens('xdai', xdaiResponse);
      const data = [...ethTokens, ...xdaiTokens];

      setTokens((currentState: TokensState) => ({
        ...currentState,
        alreadyFetched: true,
        data,
      }));
    } catch (e) {
      setTokens((currentState: TokensState) => ({
        ...currentState,
        alreadyFetched: true,
        error: true,
      }));

      // eslint-disable-next-line no-console
      console.log('address tokens api', e);
    }
  };

  // to avoid infinite calls when inside a `useEffect`
  const getTokens = useCallback<GetTokensCallback>(execute, []);

  return { tokens, getTokens };
};

export default useTokens;
