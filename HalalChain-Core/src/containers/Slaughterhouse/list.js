import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Form, Input, Button } from 'antd';
import { getPath } from '../../utils';
import './index.less';
import './main-content.less';
import moment from 'moment';
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 9
  },
  wrapperCol: {
    span: 15
  }
};
const formItemLayout1 = {
  labelCol: {
    span: 12
  },
  wrapperCol: {
    span: 12
  }
};
function gotoLink(link, router) {
  router.push(link);
}
const list = ({ router, form, submit }) => {
  const { getFieldDecorator } = form;
  return (
    <div className="table-wrap list-wrap">
      <p className="title">Animal Info</p>
      <div className="main-table">
        <Row>
          <Col span={6}>
            <FormItem label="Butcher" {...formItemLayout}>
              {getFieldDecorator('kName', {
                initialValue: 'Butcher'
              })(<Input disabled={true} />)}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="Slaughter Time" {...formItemLayout}>
              {getFieldDecorator('kFattenedTime', {
                initialValue: moment().format('YYYY-MM-DD HH:mm:ss')
              })(<Input disabled={true} />)}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="Location" {...formItemLayout}>
              {getFieldDecorator('mapPosition', {
                initialValue: '106.215941,37.992396'
              })(<Input disabled={true} />)}
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="Slaughter Process" {...formItemLayout}>
              {getFieldDecorator('killFunction', {
                initialValue: 'Qualified'
              })(<Input />)}
            </FormItem>
          </Col>
        </Row>
        <div className="img-content-wrap">
          <div className="img-content-1">
            <p className="img-title">Relevant Documents:</p>
            <div className="img-wrap">
              <img className="img" src={getPath('/img/img-1.png')} />
              <img className="img" src={getPath('/img/img-1.png')} />
            </div>
          </div>
          <div className="img-content-2">
            <p className="img-title">Relevant Documents:</p>
            <div className="img-wrap">
              <img className="img" src={getPath('/img/img-2.png')} />
              <img className="img" src={getPath('/img/img-2.png')} />
            </div>
          </div>
        </div>
        <div className="btn-wrap">
          <Button onClick={() => submit()} className="submit-btn">
            Slaughter
          </Button>
        </div>
      </div>
    </div>
  );
};
export default list;
