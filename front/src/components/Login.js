import React, { Component } from 'react'
import { uport, web3 } from 'utils/uportSetup'
import { checkAddressMNID } from 'utils/checkAddressMNID'
import { waitForMined } from 'utils/waitForMined'
import kjua from 'kjua'
import styled from 'styled-components'

const ConnectWrap = styled.section``

class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      auth: false,
      profile: null
    }
    window.auth = false;
    window.profile = null;
  }

  componentWillMount() {
  }

  componentDidMount () {
    this.requestCredentials();
  }

  requestCredentials() {
    var _contract;
    var _addr;
    uport.requestCredentials(
      {
        requested: ['name'],
        notifications: true
      },

      (uri) => {
        const qr = kjua({
          text: uri,
          fill: '#000000',
          size: 400,
          back: 'rgba(255,255,255,1)'
        })
        let aTag = document.createElement('a')
        aTag.href = uri

        // Nest QR in <a> and inject
        aTag.appendChild(qr)
        document.querySelector('#kqr').appendChild(aTag)
      }
    ).then((userProfile) => {
      window.auth = true;
      window.profile = userProfile;
      //this.props.setAuthFunction(true);
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
      <ConnectWrap>
        <h4>Connect with uPort</h4>
        <h6>Scan QR code with mobile app</h6>
        <div id='kqr' />
      </ConnectWrap>
    );
  }

}

export default Login;
