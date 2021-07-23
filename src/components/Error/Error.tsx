import './Error.css';

interface Props {
  error: string;
}

export default function Error({ error }: Props): JSX.Element {
  return <div className="Error">{error}</div>;
}
