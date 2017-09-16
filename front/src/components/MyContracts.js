import React, { Component } from 'react'
import { uport, web3 } from 'utils/uportSetup'
import { checkAddressMNID } from 'utils/checkAddressMNID'
import { waitForMined } from 'utils/waitForMined'
import PropTypes from 'prop-types';

import Login from './Login';

class MyContracts extends Component {
  constructor(props) {
    super(props)
    this.state = {
      auth: false,
      profile: null
    }
  }

  componentWillMount() {
  }

  componentDidMount () {
  }

  setAuth(_auth) {
    this.setState({ auth: _auth });
    window.auth = _auth;
  }

  setProfile(_profile) {
    this.setState({ profile: _profile });
  }

  LoginComp = () => {
    if (this.state.auth)
      return null;
    return (
      <Login
        setAuthFunction={this.setAuth.bind(this)}
        setProfileFunction={this.setProfile.bind(this)}
      />
    );
  }

  render () {
    return (
      <div>
        <this.LoginComp />
      </div>
    );
  }

}

MyContracts.contextTypes = {
  auth: PropTypes.bool
};

export default MyContracts;
