import './EnterAddress.css';
import { useHistory } from 'react-router-dom';
import getAddress from '../../utils/getAddress';

export default function EnterAddress(): JSX.Element {
  const history = useHistory();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      account: { value: string };
    };
    const account = target.account.value.trim();

    if (account !== '') {
      getAddress(account).then((address) => {
        if (address !== '') history.push(`/scan/${account}`);
      });
    }
  };

  return (
    <div className="EnterAddress">
      <p>
        The <span>Proof of attendance protocol</span> (POAP) reminds you off the{' '}
        <span>cool places</span> you’ve been to.
      </p>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="account"
          id="account"
          placeholder="vitalik.eth or 0xd8da6bf26964af9d7eed9e03e53415d37aa96045"
          maxLength={42}
          minLength={6}
          pattern="[a-zA-Z0-9\.]+"
          required
        />
        <input type="submit" />
      </form>
    </div>
  );
}
