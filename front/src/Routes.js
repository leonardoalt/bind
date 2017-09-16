import React from 'react';

import {Route, IndexRedirect} from 'react-router';

import Master from 'components/Master';
import MyContracts from 'components/MyContracts';
import NewContract from 'components/NewContract';

const Routes = (
  <Route path='/' component={Master}> 
    <Route path='my_contracts' component={MyContracts} />
    <Route path='new_contract'>
      <Route path=':type' component={NewContract} />
    </Route>
  </Route>
);

export default Routes;
