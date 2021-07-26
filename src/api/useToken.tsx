import { useState, useCallback } from 'react';
import { AccountBadge, AccountBadges } from '../shared/types';
import { api } from '../shared/constants';

interface ApiToken {
  event: {
    id: number;
    fancy_id: string;
    signer_ip: string;
    signer: string;
    name: string;
    event_url: string;
    image_url: string;
    country: string;
    city: string;
    description: string;
    year: number;
    start_date: string;
    end_date: string;
    expiry_date: string;
    created_date: string;
  };
  tokenId: string;
  owner: string;
  layer: string;
}

const parseToken = (apiToken: ApiToken): AccountBadge => ({
  tokenID: parseInt(apiToken.tokenId, 10),
  chain: apiToken.layer === 'Layer2' ? 'xdai' : 'eth',
  eventID: apiToken.event.id,
  fancy_id: apiToken.event.fancy_id,
  name: apiToken.event.name,
  description: apiToken.event.description,
  city: apiToken.event.city,
  country: apiToken.event.country,
  event_url: apiToken.event.event_url,
  imageURL: apiToken.event.image_url,
  year: apiToken.event.year.toString(),
  start_date: apiToken.event.start_date,
  timestampDate: 0,
  virtual_event: false,
  owner: apiToken.owner,
});

export type GetTokenCallback = (
  tokenID: number,
  accountBadges: AccountBadges
) => void;

export interface TokenState {
  alreadyFetched: boolean;
  error: string;
  data: AccountBadge | null;
}

export interface TokenHook {
  token: TokenState;
  getToken: GetTokenCallback;
}

const useToken = (): TokenHook => {
  const [token, setToken] = useState<TokenState>({
    alreadyFetched: false,
    error: '',
    data: null,
  });

  const execute = async (
    tokenID: number,
    accountBadges: AccountBadges
  ): Promise<void> => {
    try {
      if (accountBadges.length > 0) {
        const badge = accountBadges.filter(
          (accountBadge) => accountBadge.tokenID === tokenID
        );
        const data = badge[0];

        setToken({
          alreadyFetched: true,
          error: '',
          data,
        });
      } else {
        const response: Response = await fetch(`${api.rest}/token/${tokenID}`);
        const jsonResponse = await response.json();

        if (!response.ok || jsonResponse?.statusCode) {
          throw new Error(jsonResponse);
        }

        const data: AccountBadge = parseToken(jsonResponse);

        setToken({
          alreadyFetched: true,
          error: '',
          data,
        });
      }
    } catch {
      setToken({
        alreadyFetched: true,
        error: `there was an error fetching TOKEN`,
        data: null,
      });
    }
  };

  const getToken = useCallback<GetTokenCallback>(
    (tokenID, accountBadges) => execute(tokenID, accountBadges),
    []
  );

  return { token, getToken };
};

export default useToken;
