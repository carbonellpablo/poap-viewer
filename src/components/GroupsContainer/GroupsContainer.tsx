import './GroupsContainer.css';
import { AccountBadges } from '../../shared/types';

interface Props {
  badgesToRender: AccountBadges;
}

export default function GroupsContainer({
  badgesToRender,
}: Props): JSX.Element {
  // eslint-disable-next-line no-console
  console.log(badgesToRender);

  return <div className="GroupsContainer" />;
}
