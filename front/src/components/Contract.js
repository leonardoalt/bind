import React, { Component } from 'react'
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';

import lodash from 'lodash';
import PropTypes from 'prop-types'
import BigNumber from 'bignumber.js';
import contract from 'truffle-contract';

import ContractJson from 'build/contracts/Contract.json';
import {instantiateContract} from 'utils/contract';
import { uport, web3 } from 'utils/uportSetup';

import Printer from './Printer';

import axios from 'axios';

class Contract extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: false,
      contractInstance: null,
      seller: '',
      sellerName: '',
      buyer: '',
      buyerName: '',
      desc: '',
      amount: new BigNumber(0),
      signed: false,
      print: false,
      transactionPending: false
    }
  }

  componentWillMount() {
    this.instantiate();
  }

  async instantiate() {
    var _contract = null;
    var _contractInstance = null;
    var _amount = '';
    var _desc = '';
    var _sellerName = '';
    var _seller = '';
    var _buyerName = '';
    var _buyer = '';
    var _signed = false;
    var _desc_hash = '';
    try {
      const _contract = contract(ContractJson);  
      _contract.setProvider(web3.currentProvider);
      console.log(this.props.contract);
      _contractInstance = await _contract.at(this.props.contract);
      //_contract = await instantiateContract(ContractJson, this.context.web3.web3.currentProvider)
      _seller = await _contractInstance.seller();
      _sellerName = await _contractInstance.sellerName();
      _buyer = await _contractInstance.buyer();
      _buyerName = await _contractInstance.buyerName();
      _amount = await _contractInstance.payAmount();
      _desc_hash = await _contractInstance.desc();
      let filepath = 'http://ipfs.io/ipfs/' + _desc_hash;
      try {
        let file = await axios.get(filepath);
        _desc = file.data;
      } catch (err) {
        _desc = _desc_hash;
      }
      _signed = await _contractInstance.signed();
      console.log('Signed is');
      console.log(_signed);
      console.log(_seller);
      console.log(_buyer);
      console.log(_amount);
      console.log(this.props.userAddress);
    } catch(e) {
      console.log('Error: ' + e);
    }
    this.setState({ contractInstance: _contractInstance,
                    amount: _amount, desc: _desc,
                    seller: _seller, buyer: _buyer, signed: _signed,
                    sellerName: _sellerName, buyerName: _buyerName});
  }

  Title = () => {
    if (this.props.userAddress === this.state.seller)
      return 'Contract with ' + this.state.buyerName;
    if (this.props.userAddress === this.state.buyer)
      return 'Contract with ' + this.state.sellerName;
    console.log('Error: MyContract contains contract but user is neither buyer or seller');
    return null;
  }

  PrintButtonAct = () => {
    this.props.setPrintFunction(this.state);
  }

  PrintButton = () => {
    if (this.state.isExpanded === false)
      return null;
    return <RaisedButton style={{margin: 12}} onTouchTap={() => this.PrintButtonAct()} label={"Print contract"} primary />
  }

  sign() {
    this.setState({ transactionPending: true });
    this.state.contractInstance.buyerSign({
          from: this.props.userAddress,
          value: this.state.amount
    }).then((tx) => {
      console.log(tx);
      this.setState({ transactionPending: false, signed: true });
    })
    .catch(err => {
      console.log('Error: ' + err);
      this.setState({ transactionPending: false });
    });
  }

  SignButton = () => {
    if (this.state.isExpanded === false)
      return null;
 
    if (this.state.transactionPending)
      return <CircularProgress style={{margin:12}}/>;

    if (this.props.userAddress !== this.state.buyer)
      return null;

    return (
      <RaisedButton
        label="Sign"
        onClick={() => this.sign()}
        primary
        style={{margin:12}}
        disabled={this.state.signed}
      />
    );
  }

  buyerHasSigned = () => {
    if (this.state.signed)
      return 'Buyer has signed';
    return 'Buyer has not signed';
  } 

  render() {
    return (
    <div>
      <div id="react-no-print">
      <Card style={{marginRight: 80, marginBottom: 20}}
            onExpandChange={lodash.debounce(this.onExpand, 150)}
            expanded={this.state.isExpanded}
      >
        <CardHeader
          actAsExpander={true}
          showExpandableButton={true}
          title={this.Title()}
        />
        <CardText expandable={true}>
          <Table selectable={false}>
            <TableBody displayRowCheckbox={false}>
              <TableRow displayBorder={false}>
                <TableRowColumn style={{fontSize: 16}}>Seller: {this.state.sellerName}</TableRowColumn>
                <TableRowColumn style={{fontSize: 16}}>Buyer: {this.state.buyerName}</TableRowColumn>
                <TableRowColumn style={{fontSize: 16}}>Value: {this.state.amount.toString()}</TableRowColumn>
                <TableRowColumn style={{fontSize: 16}}>{this.buyerHasSigned()}</TableRowColumn>
              </TableRow>
            </TableBody>
          </Table>
          Description: {this.state.desc}
        </CardText>
        <div
          style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}
        >
          <this.PrintButton />
          <this.SignButton />
        </div>
      </Card>
      </div>
    </div>
        
    );
  }

  onExpand = () => {
    this.setState(previousState => ({isExpanded: !previousState.isExpanded}));
  }

}

export default Contract;
