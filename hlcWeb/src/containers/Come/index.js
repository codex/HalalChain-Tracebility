import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Table,Button } from 'antd';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { getPath } from '../../utils';
import * as comeActions from '../../actions/come';
import './index.less';

class Come extends Component {
  state = {
    selectedRowKeys:[],
    dataSource : [{
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号'
    }, {
      key: '2',
      name: '胡彦祖',
      age: 42,
      address: '西湖区湖底公园1号'
    }],
    columns:[{
      title: '姓名',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    }, {
      title: '住址',
      dataIndex: 'address',
      key: 'address',
    }]
  }
  componentWillMount() {

  }

  gotoLink(link) {
    this.props.router.push(link);
  }
  onSelectChange = (selectedRowKeys) => {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  }
  submit() {
    const data = Object.assign(
      {},
      {
        data:{
          fcn:'Register',
          args:["Register","{\"productId\":\"800020009\",\"productName\":\"第8系列测试2段二号\"}"],
          peers:["peer0.creater.com","peer1.creater.com"]
        }
      },
      {
        success: userInfo => {
          this.props.router.push('/');
        },
        fail: (result, isInvite) => {
          
        }
      }
    );
    this.props.comeActions.addCome(data);
  }
  render() {
    const { user, project } = this.props;
    const {selectedRowKeys} = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    return (
      <div className="home-wrapper ">
        <Table rowSelection={rowSelection} dataSource={this.state.dataSource} columns={this.state.columns} />
        <Button onClick={this.submit.bind(this)}>Submit</Button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    come: state.come,
    // home: state.home,
    // project: state.project
  };
}

function mapDispatchToProps(dispatch) {
  return {
    comeActions: bindActionCreators(comeActions, dispatch),
    // projectActions: bindActionCreators(projectActions, dispatch)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Come);
