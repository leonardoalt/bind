import React, { Component } from 'react';
import PrintTemplate from 'react-print';
import QRCodeWriter from './qrcodeC/src';

class Printer extends Component {
  constructor(props){
    super(props)
    this.state = {
    }
  }

  render() {
    return (
      <PrintTemplate>
        <div style={{marginLeft:-210, color:'black'}}>
          <h1>Contract between {this.props.sellerName} and {this.props.buyerName}</h1>
          <h3>Value: {this.props.amount.toString()}</h3>
          <p>
            {this.props.desc}
          </p>
        </div>
      </PrintTemplate>
    )
  }
}
export default Printer;
