import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Select, Row, Col, Form, Button, Input, Modal, Spin } from 'antd';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { getPath } from '../../utils';
import Message from '../../utils/Message';
import * as comeActions from '../../actions/come';
import Left from '../../components/Left';
import peersConfig from '../../configs/peers';
import TableCell from './tableCell';
import { outResult, outPlace } from '../../configs/typeList';
import List from './list';
import './index.less';
import moment from 'moment';

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
class Out extends Component {
  state = {
    isLoading: false,
    selectedRowKeys: [],
    visible: false,
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
        width: '240px',
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
        width: '130px',
        dataIndex: 'kind'
      },
      {
        title: 'Lairage Time',
        width: '180px',
        dataIndex: 'lairageTime'
      },
      {
        title: 'Out-Fence',
        width: '130px',
        dataIndex: 'fattenedTime'
      },
      {
        title: 'Location',
        width: '120px',
        dataIndex: 'mapPosition'
      },
      {
        title: 'Operator',
        width: '120px',
        dataIndex: 'iName'
      },
      {
        title: 'Animal Age',
        dataIndex: 'days',
        width: '130px',
        render: (text, record, index) => {
          return record.days;
          // if (!record.productId) {
          //   return '';
          // } else {
          //   const { getFieldDecorator } = this.props.form;
          //   return getFieldDecorator(`days_${index}`, {
          //     initialValue: record.days
          //   })(<Input />);
          // }
        }
      }
    ]
  };
  componentWillMount() {
    document.title = 'Out-Fence';
    // const orgName = this.props.user.user.orgName;
    // const pathName = this.props.location.pathname;
    // const createArray = ['/', 'out'];
    // const transferArray = ['prekill', 'kill'];
    // if (orgName === 'Creater') {
    //   if (transferArray.indexOf(pathName) > -1) {
    //     Message.error('Permission denied', 1, () => {
    //       window.location.href = '/login';
    //     });
    //   }
    // } else if (uorgName === 'Transfer') {
    //   if (createArray.indexOf(pathName) > -1) {
    //     Message.error('Permission denied', 1, () => {
    //       window.location.href = '/login';
    //     });
    //   }
    // }
  }

  handleProductBlur(value, index) {
    value = value.trim();
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
            // item = JSON.parse(data.payloads[0]);
            // item.fattenedTime = moment().format('YYYY-MM-DD HH:MM ss');
            // item.index = itemIndex+1;
            item = {
              ...item,
              ...JSON.parse(data.payloads[0]),
              iName: 'Farmer',
              fattenedTime: moment().format('YYYY-MM-DD HH:MM:ss')
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
      lairage: '',
      fattenedTime: '', //moment().format('YYYY-MM-DD HH:MM ss'),
      mapPosition: '',
      iName: '',
      days: ''
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1
    });
  }

  hideModal() {
    this.setState({
      visible: false
    });
  }

  okModal() {
    let data = [];
    const that = this;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          visible: false
        });
        this.state.dataSource.map((item, dataIndex) => {
          this.state.selectedRowKeys.map((keyItem, index) => {
            if (item.index === keyItem + 1) {
              const subData = JSON.stringify({
                productId: item.productId,
                comment: 'Out-Fence',
                mapPosition: item.mapPosition,
                operator: item.iName,
                fattenedTime: item.fattenedTime,
                fattenedCause: outResult.filter(
                  item => item.value == values['fattenedCause']
                )[0]['name']
              });
              const changeOwnerData = JSON.stringify({
                productId: item.productId,
                toOrgMsgId: 'butcher'
              });
              data.push(
                new Promise(function(resolve, reject) {
                  that.props.comeActions.commonAjax({
                    data: {
                      fcn: 'ChangeProduct',
                      args: ['ChangeProduct', subData],
                      peers: peersConfig
                    },
                    success: () => {
                      that.props.comeActions.commonAjax({
                        data: {
                          fcn: 'ChangeOwner',
                          args: ['ChangeOwner', changeOwnerData],
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
                      reject('ChangeProduct failed');
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

  submit() {
    if (!this.state.selectedRowKeys.length) {
      Message.warning('Please input the out-fence item');
      return;
    }
    let isOk = true;
    this.state.selectedRowKeys.map(itemIndex => {
      if (
        this.state.dataSource[itemIndex] &&
        this.state.dataSource[itemIndex]['productId']
      ) {
      } else {
        isOk = false;
      }
    });
    if (!isOk) {
      Message.error('Please input the out-fence item');
      return;
    }
    this.setState({
      visible: true
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
      <div className="out-wrapper">
        <div className="content">
          <p className="title">Farming Out Fence Operation</p>
          <div className="main-table">
            <List listProps={listProps} />
            <div className="btn-wrap">
              <Button
                className="submit-btn-add"
                onClick={this.handleAdd.bind(this)}
              >
                Add
              </Button>
              <Button onClick={this.submit.bind(this)} className="submit-btn">
                Confirm
              </Button>
            </div>
          </div>
        </div>
        <Modal
          title="Confirm"
          visible={this.state.visible}
          onOk={this.okModal.bind(this)}
          onCancel={this.hideModal.bind(this)}
          okText="Submit"
        >
          <Row>
            <Col>
              <FormItem label="remark" {...formItemLayout}>
                {getFieldDecorator('fattenedCause', {
                  initialValue: '',
                  rules: [{ required: true, message: 'please select remark' }]
                })(
                  <Select className="select-modal">
                    {outResult.map((item, index) => {
                      return (
                        <Option key={index} value={item.value}>
                          {item.name}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </FormItem>
            </Col>
            <Col>
              <FormItem label="destination" {...formItemLayout}>
                {getFieldDecorator('destination', {
                  initialValue: '',
                  rules: [
                    { required: true, message: 'please select destination' }
                  ]
                })(
                  <Select className="select-modal">
                    {outPlace.map((item, index) => {
                      return (
                        <Option key={index} value={item.value}>
                          {item.name}
                        </Option>
                      );
                    })}
                  </Select>
                )}
              </FormItem>
            </Col>
          </Row>
        </Modal>
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
// Home = Form.create(Home);
Out = Form.create()(Out);
export default connect(mapStateToProps, mapDispatchToProps)(Out);
