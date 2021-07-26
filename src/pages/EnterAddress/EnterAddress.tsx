import { useEffect, useState } from 'react';
import './EnterAddress.css';
import { useHistory } from 'react-router-dom';
import useAccount from '../../hooks/useAccount';
import Loading from '../../components/Loading/Loading';

export default function EnterAddress(): JSX.Element {
  const history = useHistory();
  const { account, setAccount } = useAccount();
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const target = e.target as typeof e.target & {
      unverifiedAccount: { value: string };
    };
    const unverifiedAccount = target.unverifiedAccount.value.trim();

    if (unverifiedAccount !== '') setAccount(unverifiedAccount);
  };

  useEffect(() => {
    if (account.verified) {
      setLoading(false);
      if (!account.error) {
        history.push(`/scan/${account.ens || account.eth}`);
      }
    }
  }, [account]);

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="EnterAddress">
      <p className="error">{account.error}</p>
      <p>
        The <span>Proof of attendance protocol</span> (POAP) reminds you off the{' '}
        <span>cool places</span> you’ve been to.
      </p>
      <form onSubmit={handleSubmit}>
        <input
          className="inputAddress"
          type="text"
          name="unverifiedAccount"
          id="unverifiedAccount"
          placeholder="vitalik.eth or 0xd8da6bf26964af9d7eed9e03e53415d37aa96045"
          maxLength={42}
          minLength={6}
          pattern="[a-zA-Z0-9\.]+"
          autoFocus
          required
        />

        <input className="submitButton" type="submit" value="Display Badges" />
      </form>
    </div>
  );
}
