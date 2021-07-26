import './Badge.css';
import { Link } from 'react-router-dom';
import LazyLoad from 'react-lazyload';
import { BadgeWithSize } from '../../shared/types';

interface Props {
  badge: BadgeWithSize;
}

export default function Badge({ badge }: Props): JSX.Element {
  const { imageURL, name, size, tokenID } = badge;
  const sizeInPx = size === 'large' ? '200px' : '100px';

  return (
    <Link className="BadgeLink" to={`/token/${tokenID}`} title={name}>
      <LazyLoad height={sizeInPx} offset={500}>
        <img
          className={`BadgeImage ${size}`}
          src={imageURL}
          alt={name}
          title={name}
          height={sizeInPx}
          width={sizeInPx}
        />
      </LazyLoad>
    </Link>
  );
}
