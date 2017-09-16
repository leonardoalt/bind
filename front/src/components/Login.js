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
      this.props.setProfileFunction(userProfile);
      console.log(userProfile);
      console.log(uport);
      console.log(web3);
    }).catch(err => {
      console.log('Error: ' + err);
    })
  }

  render () {
    return (
      <div>
      </div>
    );
  }

}

export default Login;
