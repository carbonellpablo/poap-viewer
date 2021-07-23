import './BadgeGroup.css';
import { IBadgeGroup } from '../../shared/types';
import Badge from '../Badge/Badge';

interface Props {
  badgeGroup: IBadgeGroup;
}

export default function BadgeGroup({ badgeGroup }: Props): JSX.Element {
  return (
    <div className="BadgeGroup">
      <h2>{badgeGroup.title}</h2>
      {badgeGroup.badges.map((badge) => (
        <Badge key={badge.tokenID} badge={badge} />
      ))}
    </div>
  );
}
