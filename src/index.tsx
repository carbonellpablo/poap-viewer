import React from 'react';
import ReactDOM from 'react-dom';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import './index.css';
import App from './containers/App';

ReactDOM.render(
  <React.StrictMode>
    <Router>
      <Switch>
        <Route path="/" component={App} />
      </Switch>
    </Router>
  </React.StrictMode>,
  document.getElementById('root')
);
