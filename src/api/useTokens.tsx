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
export type GetTokensCallback = (address: string) => void;

export interface TokensState {
  alreadyFetched: boolean;
  error: string;
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
  const parsedTokens: Tokens = [];

  if (apiTokens.account) {
    apiTokens.account.tokens.forEach((apiToken: ApiToken) => {
      const tokenID = apiToken.id;
      const eventID = apiToken.event.id;

      parsedTokens.push({ chain, tokenID, eventID });
    });
  }

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

const useTokens = (): TokensHook => {
  const [tokens, setTokens] = useState<TokensState>({
    alreadyFetched: false,
    error: '',
    data: [],
  });

  const execute = async (address: string): Promise<void> => {
    try {
      const [ethResponse, xdaiResponse] = await Promise.all([
        fetchGraphQL(api.graphql.eth, address),
        fetchGraphQL(api.graphql.xdai, address),
      ]);

      const data = [
        ...parseTokens('eth', ethResponse),
        ...parseTokens('xdai', xdaiResponse),
      ];

      setTokens({
        alreadyFetched: true,
        error: '',
        data,
      });
    } catch {
      setTokens({
        alreadyFetched: true,
        error: `there was an error fetching TOKENS`,
        data: [],
      });
    }
  };

  // to avoid infinite calls when inside a `useEffect`
  const getTokens = useCallback<GetTokensCallback>(
    (address) => execute(address),
    []
  );

  return { tokens, getTokens };
};

export default useTokens;
