import React from 'react';
import Main from './containers/main';
import Home from './containers/home';
import Welcome from './containers/welcome';
import { Route, IndexRoute } from 'react-router';

export default (
  <Route path="/" component={Main}>
    <IndexRoute component={Home} />
    <Route path="/welcome" component={Welcome} />
  </Route>
);
