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
      <h4>{ens || fancyEth}</h4>
      {ens ? <h5>({fancyEth})</h5> : null}
    </Link>
  );
}
