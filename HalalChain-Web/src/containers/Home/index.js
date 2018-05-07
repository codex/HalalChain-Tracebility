import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { Select, Row, Col, Form, Button, Input, InputNumber, Spin } from 'antd';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { getPath } from '../../utils';
import * as comeActions from '../../actions/come';
// import ReactSwipe from 'react-swipe';
import Left from '../../components/Left';
import peersConfig from '../../configs/peers';
import Message from '../../utils/Message';
import List from './list';
import TableCell from '../../components/TableCell';
import { kindConfig, typeConfig } from '../../configs/typeList';
import './index.less';
import _ from 'lodash';
import moment from 'moment';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 10
  },
  wrapperCol: {
    span: 14
  }
};
const formItemLayout1 = {
  labelCol: {
    span: 10
  },
  wrapperCol: {
    span: 14
  }
};
const Option = Select.Option;

const getProductId = () => {
  const time = moment().format('YYYY-MM-DD-HH-MM-ss');
  const timeArray = time.split('-');
  const letterArray1 = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
  const letterArray2 = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j'];
  const letterArray3 = ['H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q'];
  const letterArray4 = ['h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q'];
  const letterArray5 = ['R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'C'];
  const letterArray6 = ['r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'c'];
  let Code = [];
  Code.push(
    `H${letterArray1[timeArray[2][0]]}${letterArray1[timeArray[2][1]]}`
  );
  Code.push(`${letterArray6[timeArray[1][0]]}${letterArray6[timeArray[1][1]]}`);
  Code.push(
    `${letterArray2[timeArray[0][0]]}${letterArray2[timeArray[0][1]]}${
      letterArray2[timeArray[0][2]]
    }${letterArray2[timeArray[0][3]]}`
  );
  Code.push(`${letterArray3[timeArray[3][0]]}${letterArray3[timeArray[3][1]]}`);
  Code.push(`${letterArray5[timeArray[4][0]]}${letterArray5[timeArray[4][1]]}`);
  Code.push(`${letterArray4[timeArray[5][0]]}${letterArray4[timeArray[5][1]]}`);
  return Code.join('');
};
const currData = moment().format('YYYYMMDD');
const initBatches = `YZBS${currData}${parseInt(Math.random() * 1000)}`;

class Home extends Component {
  state = {
    selectedRowKeys: [],
    count: 1,
    isLoading: false,
    dataSource: [],
    columns: [
      {
        title: 'No.',
        dataIndex: 'index'
      },
      {
        title: 'Ear Tag No.',
        dataIndex: 'productId'
      },
      {
        title: 'Lairage Time',
        dataIndex: 'lairageTime'
      },
      {
        title: 'Location',
        dataIndex: 'mapPosition'
      },
      {
        title: 'Operator',
        dataIndex: 'iName'
      },
      {
        title: 'Animal Age',
        dataIndex: 'days',
        width: '10%',
        render: (text, record, index) => {
          const { getFieldDecorator } = this.props.form;
          console.log(record);
          // return <Input />;
          return getFieldDecorator(`days_${index}`, {
            initialValue: record.days
          })(<InputNumber />);
          // <TableCell
          //   val={record}
          //   other={{ className: 'updateTableCell' }}
          //   // isShowEdit={true}
          //   onInputChange={this.handleTableCell.bind(this)}
          // />
        }
      },
      {
        title: 'Health Condition',
        dataIndex: 'condition',
        width: '15%',
        render: (text, record, index) => {
          // return <Input />;
          const { getFieldDecorator } = this.props.form;
          return getFieldDecorator(`condition_${index}`, {
            initialValue: record.condition
          })(<Input />);
          // <TableCell
          //   val={value}
          //   other={{ className: 'updateTableCell' }}
          //   isShowEdit={true}
          //   onInputChange={this.handleTableCell.bind(this)}
          // />
        }
      }
    ],
    typeList: []
  };

  componentWillMount() {
    document.title = 'Lairage';
  }

  gotoLink(link) {
    this.props.router.push(link);
  }
  handleTableCell(val) {}

  kindChange(value) {
    const { setFieldsValue } = this.props.form;
    const typeList = typeConfig[value];
    setFieldsValue('type', '');
    this.setState({
      typeList
    });
  }

  handleAdd() {
    const { count, dataSource } = this.state;
    const newData = {
      index: count,
      productId: getProductId(),
      lairageTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      mapPosition: '107.436001,37.759468',
      iName: 'Breeder',
      days: '0',
      condition: 'Qualified'
    };
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1
    });
  }

  submit() {
    let data = [];
    const { getFieldValue } = this.props.form;
    let that = this;
    if (!this.state.selectedRowKeys.length) {
      Message.warning('Please input the in-fence item');
      return;
    }
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const kindValue = kindConfig.filter(
          item => item.type == values['kind']
        )[0]['name'];
        const typeArry = typeConfig[values['kind']];
        const type = typeArry.filter(
          item => item.type * 1 == values['type'] * 1
        )[0]['name'];

        this.state.dataSource.map((item, dataIndex) => {
          this.state.selectedRowKeys.map((keyItem, index) => {
            if (item.index === keyItem + 1) {
              item.kind = kindValue;
              item.type = type;
              item.penNum = values['penNum'];
              item.inModule = values['inModule'];
              item.days = String[`days_${dataIndex}`];
              item.condition = values[`condition_${dataIndex}`];
              data.push(
                new Promise(function(resolve, reject) {
                  that.props.comeActions.addCome({
                    data: {
                      fcn: 'Register',
                      args: [
                        'Register',
                        // '{"productId":"12104-'+index+'","productName":"测试","InModule":"XXXX1","kind":"羊","type":"红烧羊","mapPosition":"北纬17°东经134°","iSerial":"AX00010001","lairage":"2001-01-01","days":"50","condition":"良好","comment":"入栏","penNum":"A1"}'
                        JSON.stringify(item)
                      ],
                      peers: peersConfig
                    },
                    success: () => {
                      resolve('Success');
                    },
                    fail: () => {
                      reject('Failed');
                    }
                  });
                })
              );
              this.setState({ isLoading: true });
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
                  Message.success('Success', 1);
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
    const kindList = kindConfig;
    const { typeList, isLoading } = this.state;
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
      <div className="home-wrapper ">
        <div className="content">
          <p className="title">Farming Lairage Operation</p>
          <div className="main-table">
            <Row>
              <Col span={10}>
                <FormItem
                  wrapperCol={{ color: '#323232', fontSize: '24px' }}
                  className="filter-title"
                  label="Species"
                  {...formItemLayout1}
                >
                  {getFieldDecorator('kind', {
                    initialValue: '',
                    rules: [{ required: true }]
                  })(
                    <Select
                      style={{ width: '100px' }}
                      showSearch
                      onChange={this.kindChange.bind(this)}
                    >
                      {kindList &&
                        kindList.map((selectOption, index) => {
                          return (
                            <Option key={index + ''} value={selectOption.type}>
                              {selectOption.name}
                            </Option>
                          );
                        })}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem
                  wrapperCol={{ color: '#323232', fontSize: '24px' }}
                  className="filter-title"
                  label="Breed"
                  {...formItemLayout1}
                >
                  {getFieldDecorator('type', {
                    initialValue: '',
                    rules: [{ required: true }]
                  })(
                    <Select showSearch style={{ width: '150px' }}>
                      {typeList &&
                        typeList.map((selectOption, index) => {
                          return (
                            <Option key={index + ''} value={selectOption.type}>
                              {selectOption.name}
                            </Option>
                          );
                        })}
                    </Select>
                  )}
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col span={10}>
                <FormItem
                  wrapperCol={{ color: '#323232', fontSize: '24px' }}
                  className="filter-title"
                  label="Housing"
                  {...formItemLayout1}
                >
                  {getFieldDecorator('penNum', {
                    initialValue: '',
                    rules: [{ required: true, message: 'Please input Housing' }]
                  })(<Input />)}
                </FormItem>
              </Col>
              <Col span={10}>
                <FormItem
                  wrapperCol={{ color: '#323232', fontSize: '24px' }}
                  className="filter-title"
                  label="Batches"
                  {...formItemLayout1}
                >
                  {getFieldDecorator('inModule', {
                    initialValue: initBatches,
                    rules: [{ required: true, message: 'Please input Batches' }]
                  })(<Input />)}
                </FormItem>
              </Col>
            </Row>
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
            {isLoading && (
              <div className="loading-wrap">
                <Spin size="large" />
              </div>
            )}
          </div>
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
// Home = Form.create(Home);
Home = Form.create()(Home);
export default connect(mapStateToProps, mapDispatchToProps)(Home);
