import './Badge.css';
import { Link } from 'react-router-dom';
import LazyLoad from 'react-lazyload';

import { BadgeWithSize } from '../../shared/types';

interface Props {
  badge: BadgeWithSize;
}

export default function Badge({ badge }: Props): JSX.Element {
  const { imageURL, name, size, tokenID } = badge;
  const sizeInPx = size === 'large' ? '240px' : '140px';

  return (
    <Link className={`link${size}`} to={`/token/${tokenID}`} title={name}>
      <LazyLoad
        height={sizeInPx}
        resize
        style={{ width: sizeInPx }}
        overflow
        offset={400}
        scrollContainer=".BadgeGroup"
      >
        <img
          className={`BadgeImage ${size}`}
          src={imageURL}
          alt={name}
          title={name}
        />
      </LazyLoad>
    </Link>
  );
}
