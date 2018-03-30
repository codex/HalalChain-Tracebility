import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { BackTop, Icon, Modal } from 'antd';
import * as userActions from '../../actions/user';
import { getPath } from '../../utils';
import Message from '../../utils/Message';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import Left from '../../components/Left';
import './layout.less';
// import './../index.less';

class Layout extends Component {
  state = {
    isShowDialog: false
  };
  componentWillMount() {
    if (!window.fromSelf) {
      window.fromSelf = true;
    }
  }
  handleDialog(isShow) {
    this.setState({
      isShowDialog: isShow
    });
  }
  onLogout() {
    // this.props.userActions.logout({
    //   success: () => {
    //     this.props.router.push('/login');
    //   }
    // });
  }
  handleOk() {}
  render() {
    const { routes, location, router } = this.props;
    const routerInfo = routes[routes.length - 1];
    const isLoginPage = routerInfo.path == '/login';
    const { fixedMenu } = routerInfo;
    const { isShowDialog } = this.state;
    return (
      <div className={isLoginPage ? 'layout-login' : 'layout'}>
        {!isLoginPage && (
          <Header
            router={router}
            location={this.props.location}
            userInfo={this.props.user}
            routerInfo={routerInfo}
            handleDialog={this.handleDialog.bind(this)}
          />
        )}
        {isLoginPage ? (
          <div className="layout-login">{this.props.children}</div>
        ) : (
          <div className="layout-container">
            <div className="left-wrap">
              <Left location={this.props.location} />
            </div>
            <div className="right-wrap">{this.props.children}</div>
          </div>
        )}
        {!isLoginPage && <Footer />}
        {isShowDialog && (
          <div className="dialog-wrap">
            <div className="dialog-ms" />
            <div
              onClick={() => this.handleDialog(false)}
              className="dialog-img"
            />
          </div>
        )}
        {/* <Modal
          // title="Basic Modal"
          visible={isShowDialog}
          onOk={this.handleDialog.bind(this)}
          onCancel={this.handleCancel}
        > */}
        {/* <div className="dialog-img" /> */}
        {/* <img  src={getPath('/img/dialog-img.png')} /> */}
        {/* </Modal> */}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    userActions: bindActionCreators(userActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
