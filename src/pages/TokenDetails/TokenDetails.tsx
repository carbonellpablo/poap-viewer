import './TokenDetails.css';

import { AccountBadge } from '../../shared/types';

interface Props {
  badgeToRender: AccountBadge | null | undefined;
}

export default function TokenDetails({ badgeToRender }: Props): JSX.Element {

  return (
    <div className="TokenDetails">
      <pre>{JSON.stringify(badgeToRender, null, 2)}</pre>
    </div>
  );
}
