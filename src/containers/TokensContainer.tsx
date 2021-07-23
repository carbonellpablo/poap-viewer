import { useEffect, useState } from 'react';
import { useRouteMatch } from 'react-router-dom';
import { EventsState } from '../api/useEvents';

import useTokens from '../api/useTokens';
import useToken from '../api/useToken';
import AddressTokens from '../pages/AddressTokens/AddressTokens';
import TokenDetails from '../pages/TokenDetails/TokenDetails';
import Loading from '../components/Loading/Loading';
import NoBadges from '../components/NoBadges/NoBadges';
import Error from '../components/Error/Error';

import useAccount from '../hooks/useAccount';
import { Events, Tokens, AccountBadges, AccountBadge } from '../shared/types';

export interface Props {
  events: EventsState;
}

interface Params {
  unverifiedAccount: string;
  unverifiedTokenID: string;
}

function generateAccountBadges(events: Events, tokens: Tokens): AccountBadges {
  if (tokens.length === 0) return [];

  return tokens.map((token) => {
    const { tokenID, chain, eventID } = token;

    return { tokenID, chain, ...events[eventID] };
  });
}

export default function TokensContainer({ events }: Props): JSX.Element {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [accountBadges, setAccountBadges] = useState<AccountBadges>([]);
  const [tokenID, setTokenID] = useState<number>();
  const [badgeToRender, setBadgeToRender] = useState<AccountBadge | null>();
  const { account, setAccount } = useAccount();
  const { tokens, getTokens } = useTokens();
  const { token, getToken } = useToken();
  const { path, params } = useRouteMatch<Params>();


  useEffect(() => {
    if (path === '/scan/:unverifiedAccount') {
      const { unverifiedAccount }: Params = params;

      if (
        unverifiedAccount !== account.eth &&
        unverifiedAccount !== account.ens
      ) {
        setAccount(unverifiedAccount);
      }
    }
    if (path === '/token/:unverifiedTokenID') {
      const regex = new RegExp('^\\d+$');
      const { unverifiedTokenID }: Params = params;

      if (unverifiedTokenID !== tokenID?.toString()) {
        if (unverifiedTokenID && regex.test(unverifiedTokenID)) {
          const parsedTokenID = parseInt(unverifiedTokenID, 10);

          setTokenID(parsedTokenID);
        } else {
          setError('not a valid token ID');
          setLoading(false);
        }
      }
    }
  }, [path]);

  useEffect(() => {
    if (account.verified) {
      if (account.error) {
        setError(account.error);
        setLoading(false);
      } else {
        getTokens(account.eth);
      }
    }
  }, [account]);

  useEffect(() => {
    if (tokenID) {
      getToken(tokenID, accountBadges);
    }
  }, [tokenID]);

  useEffect(() => {
    if (tokens.alreadyFetched && events.alreadyFetched) {
      if (tokens.error || events.error) {
        setError(tokens.error || events.error);
      } else {
        setAccountBadges(generateAccountBadges(events.data, tokens.data));
      }
      setLoading(false);
    }
  }, [tokens, events]);

  useEffect(() => {
    if (token.alreadyFetched) {
      if (token.error) {
        setError(token.error);
      } else {
        setBadgeToRender(token.data);
      }
      setLoading(false);
    }
  }, [token]);

  const renderComponent = () => {
    if (loading) {
      return <Loading />;
    }

    if (error) {
      return <Error error={error} />;
    }
    if (path === '/scan/:unverifiedAccount') {
      return accountBadges.length === 0 ? (
        <NoBadges />
      ) : (
        <AddressTokens accountBadges={accountBadges} />
      );
    }

    return <TokenDetails badgeToRender={badgeToRender} />;
  };

  return renderComponent();
}
