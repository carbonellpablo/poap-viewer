import './Error.css';

interface Props {
  error: string;
}

export default function Error({ error }: Props): JSX.Element {
  return (
    <div className="Error">
      <h2>No badges</h2>
    </div>
  );
}
