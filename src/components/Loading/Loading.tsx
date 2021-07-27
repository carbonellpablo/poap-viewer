import './Loading.css';
import { useEffect } from 'react';
import loadingGif from './loading.svg';

export default function Loading(): JSX.Element {
  // if it is loading for more than 5 seconds, refresh the whole app.
  useEffect(() => {
    // eslint-disable-next-line
    const timmer = setTimeout(() => location.reload(), 5000);

    return () => clearTimeout(timmer);
  }, []);

  return (
    <div className="Loading">
      <img alt="loading" src={loadingGif} />
    </div>
  );
}
