import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import Drawer from 'material-ui/Drawer';
import {List, ListItem, makeSelectable} from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import Visibility from 'material-ui/svg-icons/action/visibility';
import VisibilityOff from 'material-ui/svg-icons/action/visibility-off';
import Divider from 'material-ui/Divider';
import { zIndex } from 'material-ui/styles';

import _ from 'lodash';

const SelectableList = makeSelectable(List);

class NavDrawer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showUnfeatured: false
    };
  }

  Navigations = () => {
    const {
      location,
      onRequestChangeNavDrawer,
      onChangeList
    } = this.props;

    return <Drawer
      open={true}
      docked={true}
      onRequestChange={onRequestChangeNavDrawer}
      containerStyle={{zIndex: zIndex.drawer - 100}}
    >
    <AppBar
      title=''
      iconElementLeft={<img width="60%" src="static/logo-gray.svg"/>}
    />
    <SelectableList
      value={location.pathname}
      onChange={onChangeList}
    >
      <ListItem
        primaryText='My Contracts'
        href='#/my_contracts'
      />
      <ListItem
        primaryTogglesNestedList={true}
        primaryText='New contract'
        nestedItems={[
          <ListItem key='new_contract_single_pay'
                         primaryTogglesNestedList={true}
                         primaryText='Car Sale'
                         href='#/new_contract/car'
          />, 
          <ListItem key='new_contract_rent_pay'
                         primaryTogglesNestedList={true}
                         primaryText='Apartment Rental'
                         href='#/new_contract/rent'
          />
        ]}
      />
    </SelectableList>
    </Drawer>
  }
  render() {
    return <div id="react-no-print"> <this.Navigations /> </div>
  }
}

export default NavDrawer;
