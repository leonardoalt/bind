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
        title='Bind'
        showMenuIconButton={false} />
      <SelectableList
        value={location.pathname}
        onChange={onChangeList}
      >
      <ListItem
        primaryText='My Contracts'
        href='#/my_contracts'
      />
      <ListItem
        primaryText='New contract'
        href='#/new_contract'
      />
      </SelectableList>
    </Drawer>
  }
  render() {
    return <div id="react-no-print"> <this.Navigations /> </div>
  }
}

export default NavDrawer;
