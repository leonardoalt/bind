import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AppBar from 'material-ui/AppBar';
import spacing from 'material-ui/styles/spacing';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import {darkWhite, lightWhite, grey900} from 'material-ui/styles/colors';
import withWidth, {MEDIUM, LARGE} from 'material-ui/utils/withWidth';
import WarningIcon from 'material-ui/svg-icons/alert/warning';
import {red500} from 'material-ui/styles/colors';

import NavDrawer from './NavDrawer';

let welcomeLogo =
  <div style={{display: 'flex', flexDirection: 'row', justifyContent: 'center'}}>
    <h1>Welcome to Bond.</h1>
  </div>;

class Master extends Component {
  static propTypes = {
    children: PropTypes.node,
    location: PropTypes.object,
    width: PropTypes.number.isRequired,
  };

  static contextTypes = {
    router: PropTypes.object.isRequired,
  };

  static childContextTypes = {
    muiTheme: PropTypes.object,
    showUnfeatured: PropTypes.bool
  };

  state = {
    navDrawerOpen: false,
    showUnfeatured: false
  };

  getChildContext() {
    return {
      muiTheme: this.state.muiTheme,
      showUnfeatured: this.state.showUnfeatured      
    };
  }

  componentWillMount() {
    this.setState({
      muiTheme: getMuiTheme(darkBaseTheme),
    });
  }

  componentWillReceiveProps(nextProps, nextContext) {
    const newMuiTheme = nextContext.muiTheme ? nextContext.muiTheme : this.state.muiTheme;
    this.setState({
      muiTheme: newMuiTheme,
    });
  }

  getStyles() {
    const styles = {
      v1: {
        height: 40,
        backgroundColor: '#2196f3',
        display: 'flex',
        color: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        top: 0,
        width: '100%',
        zIndex: this.state.muiTheme.zIndex.appBar + 1,
      },
      v1Spacer: {
        height: 40,
      },
      appBar: {
        position: 'fixed',
        // Needed to overlap the examples
        zIndex: this.state.muiTheme.zIndex.appBar + 1,
        marginLeft: 30,
        top: 0,
      },
      root: {
        paddingTop: spacing.desktopKeylineIncrement,
        minHeight: 400,
      },
      content: {
        margin: spacing.desktopGutter,
      },
      contentWhenMedium: {
        margin: `${spacing.desktopGutter * 2}px ${spacing.desktopGutter * 3}px`,
      },
      footer: {
        backgroundColor: grey900,
        textAlign: 'center',
      },
      a: {
        color: darkWhite,
      },
      p: {
        margin: '0 auto',
        padding: 0,
        color: lightWhite,
        maxWidth: 356,
      },
      browserstack: {
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        margin: '25px 15px 0',
        padding: 0,
        color: lightWhite,
        lineHeight: '25px',
        fontSize: 12,
      },
      browserstackLogo: {
        margin: '0 3px',
      },
      iconButton: {
        color: darkWhite,
      },
    };

    if (this.props.width === MEDIUM || this.props.width === LARGE) {
      styles.content = Object.assign(styles.content, styles.contentWhenMedium);
    }

    return styles;
  }

  handleTouchTapLeftIconButton = () => {
    this.setState({
      navDrawerOpen: !this.state.navDrawerOpen,
    });
  };

  handleChangeList = (event, value) => {
    if (typeof value === 'object') {
      return;
    }
    if (value) {
      this.props.router.push(value);
    }
  };

  handleChangeMuiTheme = (muiTheme) => {
    this.setState({
      muiTheme: muiTheme,
    });
  };

  toggleUnfeatured = (featured) => {
    this.setState({showUnfeatured: featured});
  }

  render() {
    const {
      location,
      children,
    } = this.props;

    const styles = this.getStyles();

    styles.navDrawer = {
      zIndex: styles.appBar.zIndex - 1,
    };
    styles.root.paddingLeft = 256;
    styles.footer.paddingLeft = 256;

    return (
      <div>
        <div style={{marginLeft: 210}}>
          <div id="react-no-print">
          <AppBar
          onLeftIconButtonTouchTap={this.handleTouchTapLeftIconButton}
          title={this.props.location.pathname}
          zDepth={0}
          style={styles.appBar}
          showMenuIconButton={false}
        />
        </div>
          <div style={{marginTop: 73, marginLeft:60}}>
            {children ? children : welcomeLogo}
          </div>
        </div>
        <NavDrawer
          style={styles.navDrawer}
          location={location}
          docked={true}
          open={true}
          onChangeList={this.handleChangeList}
          onToggleUnfeatured={this.toggleUnfeatured.bind(this)}
        />
      </div>
    );
  }
}

export default withWidth()(Master);
