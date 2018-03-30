import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Select, Row, Col, Form, Button, Input, Spin } from 'antd';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { getPath } from '../../utils';
// import Left from '../../components/Left/slaughterLeft';
import List from './list';
import TableCell from './tableCell';
import Message from '../../utils/Message';
import peersConfig from '../../configs/peers';
import * as comeActions from '../../actions/come';
import { farmArray, outPlace } from '../../configs/typeList';
import './index.less';
import moment from 'moment';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 12
  },
  wrapperCol: {
    span: 12
  }
};
const Option = Select.Option;
class Slaughter extends Component {
  state = {
    isLoading: false,
    selectedRowKeys: [],
    count: 1,
    dataSource: [],
    columns: [
      {
        title: 'No.',
        width: '80px',
        dataIndex: 'index'
      },
      {
        title: 'Ear Tag No.',
        width: '160px',
        dataIndex: 'productId',
        render: (text, record, index) => {
          return (
            <TableCell
              val={record.productId}
              index={index}
              onInputChange={this.handleProductBlur.bind(this)}
            />
          );
        }
      },
      {
        title: 'Breed',
        width: '100px',
        dataIndex: 'kind'
      },
      {
        title: 'Farm',
        width: '100px',
        dataIndex: 'currentOwner'
      },
      {
        title: 'Animal Age',
        width: '130px',
        dataIndex: 'days',
        render: (text, record, index) => {
          return record.days;
        }
      },
      {
        title: 'Time',
        width: '120px',
        dataIndex: 'kLairageTime'
      },
      {
        title: 'Location',
        width: '120px',
        dataIndex: 'mapPosition'
      },
      {
        title: 'IOT Terminals',
        // width: '150px',
        dataIndex: 'iName'
      },

      {
        title: 'Pre Quarantine',
        dataIndex: 'kCondition',
        width: '180px',
        render: (text, record, index) => {
          if (!record.productId) {
            return '';
          }
          const { getFieldDecorator } = this.props.form;
          return getFieldDecorator(`kCondition_${index}`, {
            initialValue: record.kCondition
          })(<Input />);
        }
      }
    ]
  };

  componentWillMount() {
    document.title = 'Slaugher';
    // if (this.props.user && this.props.user.user) {
    //   const orgName = this.props.user.user.orgName || '';
    //   const pathName = this.props.location.pathname;
    //   const createArray = ['/', 'out'];
    //   const transferArray = ['prekill', 'kill'];
    //   if (orgName === 'Creater') {
    //     if (transferArray.indexOf(pathName) > -1) {
    //       Message.error('Permission denied', 1, () => {
    //         window.location.href = '/login';
    //       });
    //     }
    //   } else if (uorgName === 'Transfer') {
    //     if (createArray.indexOf(pathName) > -1) {
    //       Message.error('Permission denied', 1, () => {
    //         window.location.href = '/login';
    //       });
    //     }
    //   }
    // }
  }

  handleProductBlur(value, index) {
    if (!value) {
      return;
    }
    const subData = JSON.stringify({ ProductId: value });
    const { count, dataSource } = this.state;
    this.props.comeActions.getProductDetail({
      data: {
        fcn: 'QueryProductDetail',
        args: ['QueryProductDetail', subData],
        peers: peersConfig
      },
      success: data => {
        dataSource.map((item, itemIndex) => {
          if (itemIndex == index) {
            item = {
              ...item,
              ...JSON.parse(data.payloads[0]),
              currentOwner: farmArray[0]['name'],
              mapPosition: '106.215941,37.992396',
              iName: 'Inspector',
              kCondition: 'Qualified',
              kLairageTime: moment().format('YYYY-MM-DD HH:mm:ss')
            };
            dataSource[itemIndex] = item;
          }
        });
        this.setState({
          dataSource
        });
      },
      fail: () => {
        console.log('fail');
      }
    });
  }

  gotoLink(link) {
    this.props.router.push(link);
  }
  handleTableCell(val) {
    console.log(val);
  }
  handleAdd() {
    const { count, dataSource } = this.state;
    const newData = {
      index: count,
      productId: '',
      kind: '',
      days: '',
      mapPosition: '',
      iName: '',
      kCondition: '良好'
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1
    });
  }
  submit() {
    let data = [];
    let that = this;
    if (!this.state.selectedRowKeys.length) {
      Message.warning('Please input the Slaughter item');
      return;
    }
    this.props.form.validateFields((err, values) => {
      const killModule = values['killModule'];
      const killPenNum = values['killPenNum'];
      if (!err) {
        this.state.dataSource.map((item, dataIndex) => {
          this.state.selectedRowKeys.map((keyItem, index) => {
            if (item.index === keyItem + 1) {
              const subData = JSON.stringify({
                productId: item.productId,
                kLairageTime: item.kLairageTime,
                kCondition: values[`kCondition_${dataIndex}`],
                killModule,
                comment: 'Waiting Slaughter',
                mapPosition: item.mapPosition,
                operator: item.iName,
                killPenNum
              });
              const confirmData = JSON.stringify({
                productId: item.productId
              });
              data.push(
                new Promise(function(resolve, reject) {
                  that.props.comeActions.commonAjax({
                    data: {
                      fcn: 'ConfirmChangeOwner',
                      args: ['ConfirmChangeOwner', confirmData],
                      peers: peersConfig
                    },
                    success: () => {
                      that.props.comeActions.commonAjax({
                        data: {
                          fcn: 'ChangeProduct',
                          args: ['ChangeProduct', subData],
                          peers: peersConfig
                        },
                        success: () => {
                          resolve('Success');
                        },
                        fail: () => {
                          reject('Failed');
                        }
                      });
                    },
                    fail: () => {
                      reject('Failed');
                    }
                  });
                })
              );
              that.setState({ isLoading: true });
              Promise.all(data).then(
                function(values) {
                  if (values.length === data.length) {
                    that.setState({ isLoading: false });
                    Message.success('Success', 1, function() {
                      window.location.reload();
                    });
                  }
                },
                function(values) {
                  that.setState({ isLoading: false });
                  Message.success('Failed', 1);
                }
              );
            }
          });
        });
      }
    });
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    const { isLoading } = this.state;
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
      <div className="slaughterhouse-wrapper">
        <div className="content">
          <List
            listProps={listProps}
            handleAdd={this.handleAdd.bind(this)}
            submit={this.submit.bind(this)}
            form={this.props.form}
          />
        </div>
        {isLoading && (
          <div className="loading-wrap">
            <Spin size="large" />
          </div>
        )}
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
