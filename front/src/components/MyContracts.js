import React, { Component } from 'react'
import { uport, web3 } from 'utils/uportSetup'
import { checkAddressMNID } from 'utils/checkAddressMNID'
import { waitForMined } from 'utils/waitForMined'
import PropTypes from 'prop-types';
import {instantiateContract} from 'utils/contract';
import BindJson from 'build/contracts/Bind.json';

import Login from './Login';
import Contract from './Contract';
import Printer from './Printer';

class MyContracts extends Component {
  constructor(props) {
    super(props)
    this.state = {
      contractInstance: null,
      profile: null,
      contracts: [],
      printData: null
    }
  }

  componentWillMount() {
  }

  async instantiateContract(profile) {
    var _contractInstance = null;
    try {
      console.log(profile);
      var _addr = checkAddressMNID(profile.address);
      _contractInstance = await instantiateContract(BindJson, web3.currentProvider);
      //let abi = web3.eth.contract(BindJson['abi']);
      //_contractInstance = abi.at(BindJson['networks']['4']['address']);
      console.log(_contractInstance);
      var _contracts = [];
      var _done = false;
      var i = 0;
      while (!_done) {
        var _p;
        _p = await _contractInstance.addrContracts(_addr, i);
        if (_p === '0x')
          _done =  true;
        else
          _contracts.push({idx: i, contract: _p, userAddress: _addr});
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

  setProfileFunction(profile) {
    this.instantiateContract(profile);
  }

  LoginComp = () => {
    if (window.auth) {
      if (this.state.contractInstance === null)
          this.instantiateContract(window.profile);
      return null;
    }
    return (
      <Login
        setProfileFunction={this.setProfileFunction.bind(this)}
      />
    );
  }

  setPrint(_printData) {
    this.setState({ printData: _printData }, this.print);
  }

  print() {
    window.print();
  }

  PrintDiv = () => {
    if (this.state.printData === null)
      return null;
    return (
      <Printer
        sellerName={this.state.printData.sellerName}
        buyerName={this.state.printData.buyerName}
        amount={this.state.printData.amount}
        desc={this.state.printData.desc}
      />
    );
  }

  ListContracts = () => {
    if (!window.auth)
      return null;
    var propItems = this.state.contracts.map(prop =>
      <Contract isExpanded={false}
        key={prop.idx}
        contract={prop.contract}
        userAddress={prop.userAddress}
        setPrintFunction={this.setPrint.bind(this)}
      />
    );
    return (
      <ul style={{flexFlow: 'column', justifyContent: 'space-between'}}>
        {propItems}
      </ul>
    );
  }

  render () {
    return (
    <div>
      <div id="react-no-print">
        <this.LoginComp />
        <this.ListContracts />
      </div>
      <this.PrintDiv />
    </div>
    );
  }


}

export default MyContracts;
