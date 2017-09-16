import React, { Component } from 'react'
import {GridList, GridTile} from 'material-ui/GridList';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

import PdfExtract from './PdfExtract'

class SinglePaymentForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      buyer: '',
      amount: '',
      desc: '',
      buyerName: '',
      sellerName: ''
    }
  }

  handleOnChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({ [name]: value });
  }

  updateContract = (json) => {
    this.setState(json);
  };

  createContract = () => {
    console.log(this.props);
    console.log('create');
    this.props.createSinglePaymentContract({buyer: this.state.buyer,
                                            sellerName: this.state.sellerName,
                                            buyerName: this.state.buyerName,
                                            amount: this.state.amount,
                                            desc: this.state.desc});
  }

  Submit = () => {
    if (this.props.txPending)
      return <CircularProgress />
    return (
      <RaisedButton
        label="Create"
        onClick={() => this.createContract()}
        primary
      />
    );
  }

  render() {
    return (
      <GridList
        cols={2}
        cellHeight={100}
      >
        <GridTile>
          <TextField
            fullWidth={true}
            name="buyerName"
            value={this.state.buyerName}
            floatingLabelText="Buyer's name"
            onChange={this.handleOnChange}
          />
        </GridTile>
        <GridTile>
          <TextField
            fullWidth={true}
            name="sellerName"
            value={this.state.sellerName}
            floatingLabelText="Seller's name"
            onChange={this.handleOnChange}
          />
        </GridTile>
        <GridTile>
          <TextField
            fullWidth={true}
            name="buyer"
            value={this.state.buyer}
            floatingLabelText="Buyer's address"
            onChange={this.handleOnChange}
          />
        </GridTile>
        <GridTile>
          <TextField
            fullWidth={false}
            name="amount"
            value={this.state.amount}
            type="number"
            floatingLabelText="Value"
            onChange={this.handleOnChange}
          />
        </GridTile>
        <GridTile cols={2}>
          <TextField
            fullWidth={true}
            name="desc"
            multiLine={true}
            rows={2}
            value={this.state.desc}
            floatingLabelText="Description"
            onChange={this.handleOnChange}
          />
        </GridTile>
        <GridTile>
          <this.Submit />
          <PdfExtract updateContract={(json) => this.updateContract(json)} />
        </GridTile>
      </GridList>
    );
  }
}

export default SinglePaymentForm;
