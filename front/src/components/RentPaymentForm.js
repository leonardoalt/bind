import React, { Component } from 'react'
import {GridList, GridTile} from 'material-ui/GridList';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';
import DateTimePicker from './DateTimePicker';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import moment from 'moment';

import PdfExtract from './PdfExtract'

class RentPaymentForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      buyer: '',
      payType: 0,
      amount: '',
      firstDate: '',
      deposit: '',
      endDate: '',
      desc: ''
    }
  }

  componentWillMount() {
    this.initializeTimestamps();
  }

  initializeTimestamps = () => {
    const currentDate = moment().add(2, 'hour').toDate();
    this.setState({
      firstDate: currentDate,
      endDate: moment(currentDate).add(1, 'day').toDate()
    });
  }

  createContract = () => {
    console.log(this.props);
    console.log('create');
    this.props.createRentPaymentContract({buyer: this.state.buyer,
                                            type: this.state.payType,
                                            amount: this.state.amount,
                                            firstDate: this.state.firstDate,
                                            deposit: this.state.deposit,
                                            endDate: this.state.endDate,
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

  handleOnChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    this.setState({ [name]: value });
  }

  handleTypeChange = (event, index, value) => {
    this.setState({payType: value});
  }

  handleChangeEndDate = (date) => {
    this.setState({ endDate: new moment(date) });
  };

  handleChangeFirstDate = (date) => {
    this.setState({ firstDate: new moment(date) });
  };

  render() {
    return (
      <GridList
        cols={3}
        cellHeight={100}
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
          <SelectField
            floatingLabelText="Payment type"
            value={this.state.payType}
            onChange={this.handleTypeChange}
          >
            <MenuItem value={1} primaryText="Weekly" />
            <MenuItem value={2} primaryText="Monthly" />
            <MenuItem value={3} primaryText="Yearly" />
          </SelectField>
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
        <GridTile>
          <DateTimePicker
            autoOk={true}
            floatingLabelText="First payment date"
            defaultDate={this.state.firstDate}
            onChange={this.handleChangeFirstDate}
          />
        </GridTile> 
        <GridTile>
          <DateTimePicker
            autoOk={true}
            floatingLabelText="End of contract date"
            defaultDate={this.state.endDate}
            onChange={this.handleChangeEndDate}
          />
        </GridTile>
        <GridTile>
          <TextField
            fullWidth={false}
            name="deposit"
            value={this.state.deposit}
            type="number"
            floatingLabelText="Deposit"
            onChange={this.handleOnChange}
          />
        </GridTile>
        <GridTile cols={3}>
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
          <PdfExtract />
        </GridTile>
      </GridList>
    );
  }
}

export default RentPaymentForm;
