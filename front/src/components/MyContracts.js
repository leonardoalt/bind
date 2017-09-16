import React, { Component } from 'react'
//import { uport, web3 } from 'utils/uportSetup'
//import { checkAddressMNID } from 'utils/checkAddressMNID'
//import { waitForMined } from 'utils/waitForMined'
import PropTypes from 'prop-types';
import {instantiateContract} from 'utils/contract';
import BindJson from 'build/contracts/Bind.json';

import Login from './Login';
import Contract from './Contract';

class MyContracts extends Component {
  constructor(props) {
    super(props)
    this.state = {
      auth: false,
      contractInstance: null,
      profile: null,
      contracts: []
    }
  }

  componentWillMount() {
    this.instantiateContract();
  }

  async instantiateContract() {
    var _contractInstance = null;
    try {
      console.log(this.context.web3);
      _contractInstance = await instantiateContract(BindJson, this.context.web3.web3.currentProvider);
      //let abi = web3.eth.contract(BindJson['abi']);
      //_contractInstance = abi.at(BindJson['networks']['4']['address']);
      console.log(_contractInstance);
      var _contracts = [];
      var _done = false;
      var i = 0;
      while (!_done) {
        var _p;
        _p = await _contractInstance.addrContracts(this.context.web3.web3.eth.defaultAccount, i);
        if (_p === '0x')
          _done =  true;
        else
          _contracts.push({idx: i, contract: _p});
        ++i;
      }
      console.log(_contracts);
    } catch(e) {
      console.log('Error instantiating contract: ' + e);
    }
    this.setState({ contractInstance: _contractInstance, contracts: _contracts });
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
    var propItems = this.state.contracts.map(prop =>
      <Contract isDetailed={false}
        key={prop.idx}
        contract={prop.contract}
      />
    );
    return (
      <ul style={{flexFlow: 'column', justifyContent: 'space-between'}}>
        {propItems}
      </ul>
    );
  }

}

MyContracts.contextTypes = {
  web3: PropTypes.object
};

export default MyContracts;
