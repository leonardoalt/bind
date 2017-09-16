import React, { Component } from 'react'
import { uport, web3 } from 'utils/uportSetup'
import { checkAddressMNID } from 'utils/checkAddressMNID'
import { waitForMined } from 'utils/waitForMined'
import BigNumber from 'bignumber.js';

import {instantiateContract} from 'utils/contract';
import BindJson from 'build/contracts/Bind.json';

import Login from './Login';
import SinglePaymentForm from './SinglePaymentForm';
//import RentPaymentForm from './RentPaymentForm';
//import CustomPaymentForm from './CustomPaymentForm';

class NewContract extends Component {
  constructor(props) {
    super(props)
    this.state = {
      auth: false,
      profile: null,
      type: 0,
      contractInstance: null,
      transactionPending: false
    }
  }

  componentWillMount() {
    this.instantiateContract();
  }

  async instantiateContract() {
    var _contractInstance;
    try {
      console.log(web3);
      //_contractInstance = await instantiateContract(BindJson, web3.currentProvider);
      let abi = web3.eth.contract(BindJson['abi']);
      _contractInstance = abi.at(BindJson['networks']['4']['address']);
      console.log(_contractInstance);
    } catch(e) {
      console.log('Error instantiating contract: ' + e);
    }
    this.setState({ contractInstance: _contractInstance });
  }

  componentDidMount () {
  }

  setAuth(_auth) {
    this.setState({ auth: _auth });
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

  createSinglePaymentContract(data) {
    console.log(data);
    if (this.state.contractInstance === null)
      return;
    console.log(uport);
    console.log(web3);
    var _contract = this.state.contractInstance;
    this.setState({ transactionPending: true });
    return new Promise(function(resolve, reject) {
      _contract.createContract(data.buyer, 0, 0,
                                               new BigNumber(data.amount),
                                               0, 0, data.desc, (error, tx) => {
        if (error) reject(error);
        else resolve(tx);
      });
    })
    .then((tx) => {
      console.log(tx);
      this.setState({ transactionPending: false });
    })
    .catch(e => {
      console.log('Could not execute tx: ' + e);
    this.setState({ transactionPending: false });
    });
  }

  Form = () => {
    if (this.state.type === 0)
      return <SinglePaymentForm 
              createSinglePaymentContract={this.createSinglePaymentContract.bind(this)}
              txPending={this.state.transactionPending}
             />
    //if (this.state.type === 1)
    //  return <RentContract />;
    //return <CustomContract />;
  }

  render () {
    return (
      <div>
        <this.LoginComp />
        <this.Form/>
      </div>
    );
  }

}

export default NewContract;
