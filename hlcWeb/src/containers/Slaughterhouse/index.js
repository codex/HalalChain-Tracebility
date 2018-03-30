import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Select, Row, Col, Form, Button } from 'antd';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { getPath } from '../../utils';
import * as comeActions from '../../actions/come';
import peersConfig from '../../configs/peers';
import Left from '../../components/Left/slaughterLeft';
import Message from '../../utils/Message';
import Filter from './filter';
import List from './list';
import { livestockType, livestockchildType } from '../../configs/typeList';

import './index.less';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 7
  },
  wrapperCol: {
    span: 15
  }
};
const Option = Select.Option;
class Slaughter extends Component {
  state = {
    productId: '',
    productInfo: {
      currentOwner: '',
      type: '',
      lairageTime: '',
      fattenedTime: '',
      days: '',
      kLairageTime: '',
      kCondition: ''
    }
  };

  componentWillMount() {
    document.title = 'Slaughtering';
  }

  gotoLink(link) {
    this.props.router.push(link);
  }

  submit() {
    const that = this;
    if (!this.state.productId) {
      Message.error('Ear Tag No. needed', 1);
      return;
    }
    this.props.form.validateFields((err, values) => {
      const productId = this.state.productId;
      const kName = values['kName'];
      const kFattenedTime = values['kFattenedTime'];
      const mapPosition = values['mapPosition'];
      const killFunction = values['killFunction'];
      const comment = 'Slaughter';
      const operator = kName;
      const subData = JSON.stringify({
        productId,
        kName,
        kFattenedTime,
        mapPosition,
        killFunction,
        comment,
        operator
      });
      if (!err) {
        that.props.comeActions.commonAjax({
          data: {
            fcn: 'ChangeProduct',
            args: ['ChangeProduct', subData],
            peers: peersConfig
          },
          success: () => {
            Message.success('Success', 1, function() {
              window.location.reload();
            });
          },
          fail: () => {
            Message.error('Failed', 1);
          }
        });
      }
    });
  }

  handleSearch(value) {
    if (!value) {
      return;
    }
    const that = this;
    const subData = JSON.stringify({ ProductId: value });
    this.props.comeActions.getProductDetail({
      data: {
        fcn: 'QueryProductDetail',
        args: ['QueryProductDetail', subData],
        peers: peersConfig
      },
      success: data => {
        const productInfo = JSON.parse(data.payloads[0]);
        that.setState({
          productId: value,
          productInfo
        });
      },
      fail: () => {
        console.log('fail');
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { productInfo } = this.state;
    return (
      <div className="slaughterhouse-wrapper">
        <div className="content">
          <Filter
            productInfo={productInfo}
            handleSearch={this.handleSearch.bind(this)}
          />
          <List form={this.props.form} submit={this.submit.bind(this)} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    come: state.come
  };
}

function mapDispatchToProps(dispatch) {
  return {
    comeActions: bindActionCreators(comeActions, dispatch)
  };
}
Slaughter = Form.create()(Slaughter);
export default connect(mapStateToProps, mapDispatchToProps)(Slaughter);
