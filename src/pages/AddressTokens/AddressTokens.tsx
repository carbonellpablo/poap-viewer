import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EventsState } from '../../api/useEvents';

import useTokens from '../../api/useTokens';
import DisplayBadges from '../../components/DisplayBadges/DisplayBadges';
import Loading from '../../components/Loading/Loading';
import NoBadges from '../../components/NoBadges/NoBadges';
import Error from '../../components/Error/Error';
import InvalidAddress from '../../components/InvalidAddress/InvalidAddress';

import useAccount from '../../hooks/useAccount';
import './AddressTokens.css';
import { Events, Tokens, AccountBadges } from '../../shared/types';

export interface Props {
  events: EventsState;
}

function generateAccountBadges(events: Events, tokens: Tokens): AccountBadges {
  if (tokens.length === 0) return [];

  return tokens.map((token) => {
    const { tokenID, chain, eventID } = token;

    return { tokenID, chain, ...events[eventID] };
  });
}

export default function AddressTokens({ events }: Props): JSX.Element {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [accountBadges, setAccountBadges] = useState<AccountBadges>([]);
  const [invalidAddress, setInvalidAddress] = useState<boolean>(false);

  const { unverifiedAccount } = useParams<{ unverifiedAccount: string }>();
  const { account, setAccount } = useAccount();
  const { tokens, getTokens } = useTokens();

  useEffect(() => setAccount(unverifiedAccount), []);
  useEffect(() => {
    if (account.verified) {
      if (account.error) {
        setInvalidAddress(true);
        setLoading(false);
      } else {
        getTokens(account.eth);
      }
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

    if (invalidAddress) {
      // eslint-disable-next-line no-console
      console.log(account.error);

      return <InvalidAddress />; // {account.error}
    }

    if (error) {
      return <Error />; // {props: error}
    }

    if (accountBadges.length === 0) {
      return <NoBadges />;
    }

    return <DisplayBadges accountBadges={accountBadges} />;
  };

  return <div className="AddressTokens">{renderComponent()}</div>;
}
