import React, { Component } from 'react'
import axios from 'axios';
import RaisedButton from 'material-ui/RaisedButton';
import CircularProgress from 'material-ui/CircularProgress';

const payTypeEnum = {
  'monthly': 2,
  'weekly': 1,
  'one-time': 0
}


class PdfExtract extends Component {
  constructor(props) {
    super(props)
    this.state = {
      uploading: false,
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

    this.setState({ uploading: true });

    axios.post('http://172.30.1.150:50001/parse_contract', data, {})
         .then((response) => {
           console.log('Response is');
           console.log(response);
           // convert payType string to enum value
           let payType = payTypeEnum[response.data['payType']];
           response.data['payType'] = payType;
           this.props.updateContract(response.data);
         })
         .catch(error => {
           alert('Error uploading pdf: ' + error);
           console.log('Error: ' + error);
         })
         .then(() => {
           this.setState({ uploading: false });
         });
  }

  render() {
    if (this.state.uploading) {
      return <CircularProgress style={{margin:12}}/>
    } else {
      return <RaisedButton
               label="Read from PDF"
               containerElement="label"
               labelPosition="before"
               style={this.styles.button}
               primary
             >
        <input type="file" onChange={(e) => this.handleFileUpload(e)} style={this.styles.pdfInput}/>
      </RaisedButton>
    }
  }
 }

export default PdfExtract; 
