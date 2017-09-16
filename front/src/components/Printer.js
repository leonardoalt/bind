import React, { Component } from 'react';
import PrintTemplate from 'react-print';
import QRCodeWriter from './qrcodeC/src';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';


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
          <Table selectable={false}>
            <TableBody displayRowCheckbox={false}>
              <TableRow displayBorder={false}>
              </TableRow>
              <TableRow displayBorder={false}>
                <TableRowColumn style={{fontSize: 16}}>_____________________</TableRowColumn>
                <TableRowColumn style={{fontSize: 16}}>_____________________</TableRowColumn>
              </TableRow>
              <TableRow displayBorder={false}>
                <TableRowColumn style={{fontSize: 16}}>{this.props.sellerName}</TableRowColumn>
                <TableRowColumn style={{fontSize: 16}}>{this.props.buyerName}</TableRowColumn>
              </TableRow>
            </TableBody>
          </Table>

        </div>
      </PrintTemplate>
    )
  }
}
export default Printer;
