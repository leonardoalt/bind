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
      desc: ''
    }
  }

  handleOnChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({ [name]: value });
  }

  createContract = () => {
    console.log(this.props);
    console.log('create');
    this.props.createSinglePaymentContract({buyer: this.state.buyer,
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
        cols={3}
      >
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
            fullWidth={true}
            name="amount"
            value={this.state.amount}
            floatingLabelText="Amount"
            onChange={this.handleOnChange}
          />
        </GridTile>
        <GridTile>
          <TextField
            fullWidth={true}
            name="desc"
            value={this.state.desc}
            floatingLabelText="Description"
            onChange={this.handleOnChange}
          />
        </GridTile>
        <GridTile>
          <this.Submit />
          <PdfExtract />
        </GridTile>
      </GridList>
    );
  }
}

export default SinglePaymentForm;
