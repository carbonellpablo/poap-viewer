import './BadgeGroup.css';
import { IBadgeGroup } from '../../shared/types';
import Badge from '../Badge/Badge';

interface Props {
  badgeGroup: IBadgeGroup;
}

export default function BadgeGroup({ badgeGroup }: Props): JSX.Element {
  return (
    <div className="BadgeGroup">
      <h1>{badgeGroup.title}</h1>
      {badgeGroup.badges.map((badge) => (
        <Badge key={badge.tokenID} badge={badge} />
      ))}
    </div>
  );
}
