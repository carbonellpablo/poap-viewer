import './GroupsContainer.css';
import { title } from 'process';
import { Badges } from '../../shared/types';

interface Props {
  badgesToRender: Badges;
}

interface BadgeGroups {
  [k: string]: BadgeGroup;
}
interface BadgeGroup {
  title: string;
  badges: Badges;
}

export default function GroupsContainer({
  badgesToRender,
}: Props): JSX.Element {
  const badgeGroups: BadgeGroups = {};
  const groupIndexes: string[] = [];
  const current = new Date();
  const lastMonth = current.setDate(new Date().getDate() - 30);

  badgesToRender.forEach((badge) => {
    if (badge.timestampDate > lastMonth) {
      if (badgeGroups.lastMonth) {
        badgeGroups.lastMonth.badges.push(badge);
      } else {
        badgeGroups.lastMonth = { title: 'Last 30 days', badges: [badge] };
        groupIndexes.push('lastMonth');
      }
    } else if (badgeGroups[badge.year]) {
      badgeGroups[badge.year].badges.push(badge);
    } else {
      badgeGroups[badge.year] = { title: badge.year, badges: [badge] };
      groupIndexes.push(badge.year);
    }
  });
  const sortedGroups: BadgeGroup[] = groupIndexes.map(
    (groupTitle: string) => badgeGroups[groupTitle]
  );

  return <div className="GroupsContainer" />;
}
