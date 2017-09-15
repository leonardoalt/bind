import React, { Component } from 'react'
import { uport, web3 } from 'utils/uportSetup'
import { checkAddressMNID } from 'utils/checkAddressMNID'
import { waitForMined } from 'utils/waitForMined'

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      auth: false,
      profile: null
    }
    window.auth = false;
  }

  componentWillMount() {
  }

  componentDidMount () {
    this.requestCredentials();
  }

  requestCredentials() {
    var _contract;
    var _addr;
    uport.requestCredentials({
      requested: ['name'],
      notifications: true
    }).then((userProfile) => {
      this.props.setAuthFunction(true);
      console.log(window.auth);
      this.props.setProfileFunction(userProfile);
      console.log(userProfile);
    }).catch(err => {
      console.log('Error: ' + err);
    })
  }

  QrCode = () => {
    if (this.state.auth)
      return null;

    return (
      <div>
        <h4>Connect with uPort</h4>
        <h6>Scan QR code with mobile app</h6>
      </div>
    );
  }

  render () {
    return (
      <div>
        <this.QrCode />
      </div>
    );
  }

}

export default Login;
