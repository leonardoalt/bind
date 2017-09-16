import React, { Component } from 'react'
import { uport, web3 } from 'utils/uportSetup'
import { checkAddressMNID } from 'utils/checkAddressMNID'
import { waitForMined } from 'utils/waitForMined'
import BigNumber from 'bignumber.js';
import SelectField from 'material-ui/SelectField';
import PropTypes from 'prop-types';
import moment from 'moment';

import {instantiateContract} from 'utils/contract';
import BindJson from 'build/contracts/Bind.json';

import Login from './Login';
import SinglePaymentForm from './SinglePaymentForm';
import RentPaymentForm from './RentPaymentForm';
//import CustomPaymentForm from './CustomPaymentForm';

class NewContract extends Component {
  constructor(props) {
    super(props)
    this.state = {
      contractInstance: null,
      transactionPending: false
    }
  }

  componentWillMount() {
  }

  async instantiateContract(profile) {
    var _contractInstance;
    try {
      _contractInstance = await instantiateContract(BindJson, web3.currentProvider);
      //let abi = web3.eth.contract(BindJson['abi']);
      //_contractInstance = abi.at(BindJson['networks']['4']['address']);
      console.log(_contractInstance);
    } catch(e) {
      console.log('Error instantiating contract: ' + e);
    }
    this.setState({ contractInstance: _contractInstance });
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

  createSinglePaymentContract(data) {
    console.log(data);
    if (this.state.contractInstance === null)
      return;
    var _contract = this.state.contractInstance;
    this.setState({ transactionPending: true });
    var addr = checkAddressMNID(window.profile.address);
    console.log(addr);
    //return new Promise(function(resolve, reject) {
    //  _contract.createSinglePayContract(data.buyer,
    //                                    new BigNumber(data.amount),
    //                                    data.desc, (error, tx) => {
    //    if (error) reject(error);
    //    else resolve(tx);
    //  });
    //})
    //_contract.createSinglePayContract(data.buyer, new BigNumber(data.amount), data.desc,
    //  {from: this.context.web3.web3.eth.defaultAccount})
    _contract.createSinglePayContract(data.buyer, data.sellerName, data.buyerName, new BigNumber(data.amount), data.desc,
      {from: addr})
    .then((tx) => {
      console.log(tx);
      this.setState({ transactionPending: false });
      this.props.router.push('/my_contracts');
    })
    .catch(e => {
      console.log('Could not execute tx: ' + e);
      this.setState({ transactionPending: false });
    });
  }

  createRentPaymentContract(data) {
    console.log('rent payment data');
    console.log(data);
    if (this.state.contractInstance === null)
      return;
    var _contract = this.state.contractInstance;
    this.setState({ transactionPending: true });
    var addr = checkAddressMNID(window.profile.address);
    console.log(addr);
    //return new Promise(function(resolve, reject) {
    //  _contract.createSinglePayContract(data.buyer,
    //                                    new BigNumber(data.amount),
    //                                    data.desc, (error, tx) => {
    //    if (error) reject(error);
    //    else resolve(tx);
    //  });
    //})
    _contract.createRecurrentPayContract(data.buyer,
                                         data.sellerName,
                                         data.buyerName,
                                         new BigNumber(data.type),
                                         new BigNumber(data.amount),
                                         new BigNumber(moment(data.firstDate).unix()),
                                         new BigNumber(data.deposit),
                                         new BigNumber(moment(data.endDate).unix()),
                                         data.desc,
      {from: addr})
    .then((tx) => {
      console.log(tx);
      this.setState({ transactionPending: false });
      this.props.router.push('/my_contracts');
    })
    .catch(e => {
      console.log('Could not execute tx: ' + e);
      this.setState({ transactionPending: false });
    });
  }

  Form = () => {
    if (this.props.params.type === 'car')
      return <SinglePaymentForm 
              createSinglePaymentContract={this.createSinglePaymentContract.bind(this)}
              txPending={this.state.transactionPending}
             />
    if (this.props.params.type === 'rent')
      return <RentPaymentForm 
              createRentPaymentContract={this.createRentPaymentContract.bind(this)}
              txPending={this.state.transactionPending}
             />
    return null;
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
