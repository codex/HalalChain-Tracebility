import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { Form, Input, Button, Modal } from 'antd';
import * as userActions from '../../actions/user';
import configs from '../../configs';
import Message from '../../utils/Message';

import './login.less';

const FormItem = Form.Item;
const confirm = Modal.confirm;

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formError: null
    };
  }

  onLogin(e) {
    e.preventDefault();
    const { validateFields } = this.props.form;
    const self = this;
    let orgName = 'Transfer';
    validateFields((errors, formData) => {
      if (errors) {
        Message.info('请输入信息');
      } else {
        if (formData.username == 'demo1') {
          orgName = 'Creater';
        }
        const data = Object.assign(
          {},
          {
            data: {
              username: formData.username,
              password: formData.password,
              orgName: orgName
            }
          },
          {
            success: userInfo => {
              if (orgName === 'Creater') {
                this.props.router.push('/');
              } else {
                this.props.router.push('/preKill');
              }
            },
            fail: (result, isInvite) => {}
          }
        );
        this.props.userActions.login(data);
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { formError } = this.state;

    return (
      <div className="login">
        <p className="login-logo" />
        <div className="content">
          <Form onSubmit={this.onLogin.bind(this)}>
            <div className="login-input">
              <div className="input-wrap">
                {/* <p className="user-icon"></p> */}
                {getFieldDecorator('username', {
                  rules: [
                    {
                      required: true,
                      message: 'Please enter your account number'
                    }
                  ]
                })(
                  <Input
                    // prefix={<p className='account-icon'></p>}
                    placeholder="Please enter your account number"
                    maxLength="16"
                  />
                )}
              </div>
              {/* <div className="input-wrap">
                {getFieldDecorator('orgName', {
                  rules: [{ required: true, message: '原用户名' }]
                })(<Input placeholder="原用户名" maxLength="16" />)}
              </div> */}
              <div className="input-wrap">
                {getFieldDecorator('password', {
                  rules: [
                    { required: true, message: 'Please input a password' }
                  ]
                })(
                  <Input
                    type="password"
                    maxLength="16"
                    placeholder="Please input a password"
                  />
                )}
              </div>
            </div>
            <FormItem style={{ marginBottom: '10px' }}>
              <Button type="primary" htmlType="submit" className="login-submit">
                Sign in
              </Button>
            </FormItem>
          </Form>

          <div className="login-bottom">
            {/* <Link className="login-register" to="register">
              立即注册
            </Link> */}
            {/* <Link className="login-forget" to="resetpassword">
              忘记密码？
            </Link> */}
          </div>
          <div className="login-tip">
            <p className="tip-info">
              <span>
                Please send the Email to{' '}
                <a href="Mailto:support@hlc.com">support@hlc.com</a> to apply
                for user name and password
              </span>
              <span>
                Then visit <a href="http://demo.hlc.com">demo.hlc.com</a> and{' '}
                <a href="http://info.hlc.com">info.hlc.com</a>
              </span>
            </p>
          </div>
          <p className="copy-right">
            Copyright@2017 | HalalChain All rights reserved.
          </p>
        </div>
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

Login = Form.create()(Login);

export default connect(mapStateToProps, mapDispatchToProps)(Login);
