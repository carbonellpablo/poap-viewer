import { useEffect } from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import usePoapEvents from './api/usePoapEvents';

// components
import EnterAddress from './pages/EnterAddress/EnterAddress';
import AddressTokens from './pages/AddressTokens/AddressTokens';
import TokenDetails from './pages/TokenDetails/TokenDetails';

function App({ match }: RouteComponentProps): JSX.Element {
  const { poapEvents, getPoapEvents } = usePoapEvents();

  // fetch all the Events from the POAP REST API, parse them a bit and store them
  // this are used for the AddressToken view, not for TokenDetails.
  useEffect(() => {
    if (match.path === '/scan/' || match.path === '/') getPoapEvents();
  }, []);

  return (
    <Switch>
      <Route path="/scan/:address">
        <AddressTokens poapEvents={poapEvents} />
      </Route>
      <Route path="/token/:tokenID" component={TokenDetails} />
      <Route path="/" component={EnterAddress} />
    </Switch>
  );
}

export default App;
