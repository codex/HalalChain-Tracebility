import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Form, Row, Col, Button, Input, message } from 'antd';
import * as userActions from '../../actions/user';
import { validIsExistPhone, validPhone } from '../../utils/Validator';
import './register.less';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 }
};
const baseCaptchaUrl = 'http://www.aaa.info/site/captcha';
class Register extends Component {
  state = {
    hasPhoneCode: false,
    captchaUrl: baseCaptchaUrl
  };
  componentWillMount() {
    // this.props.userActions.getCaptCha();
  }

  onLogout() {
    this.props.userActions.logout({
      success: () => {
        this.props.router.push('/login');
      }
    });
  }
  refreshCode() {
    // this.props.userActions.getCaptCha({
    //   refresh: true
    // });
    this.setState({
      captchaUrl: `${baseCaptchaUrl}?t=${new Date()}`
    });
  }

  

  onSubmit(e) {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.userActions.register({
          data: {
            username: values.username,
            password: values.password,
            orgName: values.orgName
          },
          success: () => {
            alert(1);
          }
        });
      }
    });
  }

  render() {
    const { getFieldDecorator, getFieldValue, getFieldError } = this.props.form;
    // const { user: { captChaImg } } = this.props;
    const captChaImg = this.state.captchaUrl;
    return (
      <div className="main-wrap">
        <div className="content">
          <h3 className='register-title'>Register</h3>
          <Form layout="horizontal" onSubmit={this.onSubmit.bind(this)}>
            <FormItem {...formItemLayout} label="昵称">
              {getFieldDecorator('username', {
                rules: [
                  {
                    required: true,
                    message: '请输入您的姓名!'
                  }
                ]
              })(<Input placeholder="请输入您的姓名" maxLength="12" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="真实姓名">
              {getFieldDecorator('orgName', {
                rules: [
                  {
                    required: true,
                    message: '请输入您的姓名!'
                  }
                ]
              })(<Input placeholder="请输入您的姓名" maxLength="12" />)}
            </FormItem>
            <FormItem
              {...formItemLayout}
              label="密码"
              help="密码"
            >
              {getFieldDecorator('password', {
                rules: [
                  {
                    required: true,
                    // pattern: /[A-Za-z0-9]{6,16}/,
                    message: '请输入您的登录密码!'
                  }
                ]
              })(
                <Input
                  type="password"
                  autoComplete="off"
                  maxLength="16"
                  placeholder="请输入您的登录密码"
                />
              )}
            </FormItem>
            <Row className="submit-wrap">
              <Col span={6} />
              <Col span={14}>
                <Button
                  type="primary"
                  style={{ width: '100%' }}
                  htmlType="submit"
                >
                  提交
                </Button>
              </Col>
            </Row>
          </Form>
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
Register = Form.create()(Register);
export default connect(mapStateToProps, mapDispatchToProps)(Register);
