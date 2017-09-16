import React, { Component } from 'react'
import axios from 'axios';
import RaisedButton from 'material-ui/RaisedButton';

class PdfExtract extends Component {
  constructor(props) {
    super(props)
    this.state = {
      file: null
    }
  }

  styles = {
    button: {
      margin: 12,
    },
    pdfInput: {
      cursor: 'pointer',
      position: 'absolute',
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
      width: '100%',
      opacity: 0,
    },
  };

  handleFileUpload(event) {
    const target = event.target;
    const pdf = target.files[0];
    console.log(pdf);

    var data = new FormData();
    data.append('scan', pdf);

    axios.post('http://localhost:50001/parse_contract', data, {})
    .then((response) => {
      console.log('Response is')
      console.log(response);
    })
    .catch(error => {
      console.log('Error: ' + error);
    });
  }

  render() {
    return (
      <RaisedButton
        label="Read from PDF"
        containerElement="label"
        labelPosition="before"
        style={this.styles.button}
        primary
      >
        <input type="file" onChange={this.handleFileUpload} style={this.styles.pdfInput}/>
      </RaisedButton>
    );
  }
 }

export default PdfExtract; 
