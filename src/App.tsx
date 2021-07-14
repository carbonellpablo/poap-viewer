import { useEffect } from 'react';
import { Route, RouteComponentProps, Switch } from 'react-router-dom';
import useEvents from './api/useEvents';

// components
import EnterAddress from './pages/EnterAddress/EnterAddress';
import AddressTokens from './pages/AddressTokens/AddressTokens';
import TokenDetails from './pages/TokenDetails/TokenDetails';

function App({ match }: RouteComponentProps): JSX.Element {
  const { events, fetchEvents } = useEvents();

  // fetch all the Events from the POAP REST API, parse them a bit and store them
  // this are used for the AddressToken view, not for TokenDetails.
  useEffect(() => {
    if (match.path === '/scan/' || match.path === '/') fetchEvents();
  }, []);

  return (
    <Switch>
      <Route path="/scan/:unverifiedAccount">
        <AddressTokens events={events} />
      </Route>
      <Route path="/token/:tokenID" component={TokenDetails} />
      <Route path="/" component={EnterAddress} />
    </Switch>
  );
}

export default App;
