import './TokenDetails.css';
import { AccountBadges } from '../../shared/types';

interface Props {
  accountBadges: AccountBadges;
}
export default function TokenDetails({ accountBadges }: Props): JSX.Element {
  return <div className="TokenDetails" />;
}
