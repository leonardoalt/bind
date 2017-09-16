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

class Contract extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isExpanded: false,
      contractInstance: null,
      seller: '',
      buyer: '',
      desc: '',
      amount: new BigNumber(0)
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
    try {
      const _contract = contract(ContractJson);  
      _contract.setProvider(this.context.web3.web3.currentProvider);
      console.log(this.props.contract);
      _contractInstance = await _contract.at(this.props.contract);
      //_contract = await instantiateContract(ContractJson, this.context.web3.web3.currentProvider)
      _amount = await _contractInstance.payAmount();
      _desc = await _contractInstance.desc();
      console.log(_amount);
      console.log(_desc);
    } catch(e) {
      console.log('Error: ' + e);
    }
    this.setState({ contractInstance: _contractInstance, amount: _amount, desc: _desc });
  }

  Title = () => {
    return 'Contract';
  }

  render() {
    return (
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
                <TableRowColumn style={{fontSize: 16}}>Amount: {this.state.amount.toString()}</TableRowColumn>
                <TableRowColumn style={{fontSize: 16}}>Description: {this.state.desc}</TableRowColumn>
              </TableRow>
            </TableBody>
          </Table>
        </CardText>
      </Card>
    );
  }

  onExpand = () => {
    this.setState(previousState => ({isExpanded: !previousState.isExpanded}));
  }

}

Contract.contextTypes = {
  web3: PropTypes.object
};

export default Contract;
