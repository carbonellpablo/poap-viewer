import './Profile.css';
import makeBlockie from 'ethereum-blockies-base64';
import { Link } from 'react-router-dom';
import { AccountState } from '../../hooks/useAccount';

interface Props {
  account: AccountState;
}

export default function Profile({ account }: Props): JSX.Element {
  const { ens, fancyEth, eth } = account;
  const blockie = eth ? makeBlockie(eth) : null;

  return (
    <Link className="Profile" to={`/scan/${ens || eth}`} title="scan address">
      {blockie ? <img alt="blockie" src={blockie} /> : null}
      <h2>{ens || fancyEth}</h2>
      {ens ? <h2>({fancyEth})</h2> : null}
    </Link>
  );
}
