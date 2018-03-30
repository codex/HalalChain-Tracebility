import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Select, Row, Col, Form, Button, Input } from 'antd';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { getPath } from '../../utils';
import * as comeActions from '../../actions/come';
import peersConfig from '../../configs/peers';
import Left from '../../components/Left/';
import Left1 from '../../components/Left/slaughterLeft';
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
    dataSource: []
  };

  componentWillMount() {
    document.title = 'Comprehensive Query';
  }

  gotoLink(link) {
    this.props.router.push(link);
  }
  handleSearch(value) {
    if (!value) {
      return;
    }
    const that = this;
    const subData = JSON.stringify({ ProductId: value });
    this.props.comeActions.getProductDetail({
      data: {
        fcn: 'QueryProductChange',
        args: ['QueryProductChange', subData],
        peers: peersConfig
      },
      success: data => {
        const dataSource = JSON.parse(data.payloads[0]);
        that.setState({
          dataSource
        });
      },
      fail: () => {
        console.log('fail');
      }
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { dataSource } = this.state;
    const isSearch1 = this.props.location.pathname === '/search1';
    const listProps = {
      columns: this.state.columns,
      dataSource: this.state.dataSource,
      rowSelection: {
        selectedRowKeys: this.state.selectedRowKeys,
        onChange: keys => {
          this.setState({
            selectedRowKeys: keys
          });
        }
      }
    };
    return (
      <div className="search-wrapper">
        <div className="content">
          <List
            listProps={listProps}
            dataSource={dataSource}
            handleSearch={this.handleSearch.bind(this)}
          />
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
