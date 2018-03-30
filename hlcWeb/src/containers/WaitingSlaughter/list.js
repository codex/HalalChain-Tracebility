import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Form, Input, Button, Table } from 'antd';
import { getPath } from '../../utils';
import './index.less';
import './main-content.less';
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
const currData = moment().format('YYYYMMDD');
const initBatches = `TZBS20180327${currData}${parseInt(Math.random() * 1000)}`;
const list = ({ listProps, submit, handleAdd, form }) => {
  const { getFieldDecorator } = form;
  return (
    <div className="table-wrap list-wrap">
      <p className="title">For Slaughter Entry Operation</p>
      <div className="main-table">
        <Row>
          <Col span={10}>
            <FormItem label="Slaughter Batches" {...formItemLayout}>
              {getFieldDecorator('killModule', {
                initialValue: initBatches,
                rules: [{ required: true, message: 'Please input Batches' }]
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={10}>
            <FormItem label="Housing" {...formItemLayout}>
              {getFieldDecorator('killPenNum', {
                initialValue: '',
                rules: [{ required: true, message: 'Please input Housing' }]
              })(<Input />)}
            </FormItem>
          </Col>
        </Row>
        <Table
          {...listProps}
          // bordered
          scroll={{ x: 1300 }}
          pagination={false}
          simple
          rowKey={(record, index) => index}
        />
        <div>
          <div className="btn-wrap">
            <Button
              onClick={() => {
                handleAdd();
              }}
              className="submit-btn-add"
            >
              Add
            </Button>
            <Button
              onClick={() => {
                submit();
              }}
              className="submit-btn"
            >
              Confirm
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default list;
