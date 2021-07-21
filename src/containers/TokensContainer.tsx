import { useEffect, useState } from 'react';
import { Route, useRouteMatch, Switch } from 'react-router-dom';
import { EventsState } from '../api/useEvents';

import useTokens from '../api/useTokens';
import AddressTokens from '../pages/AddressTokens/AddressTokens';
import TokenDetails from '../pages/TokenDetails/TokenDetails';
import Loading from '../components/Loading/Loading';
import NoBadges from '../components/NoBadges/NoBadges';
import Error from '../components/Error/Error';

import useAccount from '../hooks/useAccount';
import { Events, Tokens, AccountBadges } from '../shared/types';

export interface Props {
  events: EventsState;
}

interface Params {
  unverifiedAccount: string;
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

  const { account, setAccount } = useAccount();
  const { tokens, getTokens } = useTokens();
  const matchRoute = useRouteMatch<Params>();

  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(matchRoute.path);
    if (matchRoute.path === '/scan/:unverifiedAccount') {
      const { unverifiedAccount }: Params = matchRoute.params;

      setAccount(unverifiedAccount);
    }
  }, []);

  useEffect(() => {
    if (account.verified) {
      if (account.error) {
        setError(account.error);
        setLoading(false);
      } else {
        getTokens(account.eth);
      }
      // eslint-disable-next-line no-console
      console.log(account);
    }
  }, [account]);

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

  const renderComponent = () => {
    if (loading) {
      return <Loading />;
    }

    if (error) {
      return <Error />; // {props: error}
    }

    return accountBadges.length === 0 ? (
      <NoBadges />
    ) : (
      <AddressTokens accountBadges={accountBadges} />
    );
  };

  return (
    <Switch>
      <Route path="/scan/:unverifiedAccount">{renderComponent}</Route>
      <Route path="/token/:tokenID">
        <TokenDetails accountBadges={accountBadges} />
      </Route>
    </Switch>
  );
}
