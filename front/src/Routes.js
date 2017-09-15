import React from 'react';

import {Route, IndexRedirect} from 'react-router';

import Master from 'components/Master';
import Login from 'components/Login';

const Routes = (
  <Route path='/' component={Master}> 
    <Route path='login' component={Login} />
  </Route>
);

export default Routes;
