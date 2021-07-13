import { PoapEventsState } from '../../api/usePoapEvents';
import './AddressTokens.css';

export interface Props {
  poapEvents: PoapEventsState;
}

export default function AddressTokens({ poapEvents }: Props): JSX.Element {
  return <div className="AddressTokens" />;
}
