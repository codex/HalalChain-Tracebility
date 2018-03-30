import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Form, Input } from 'antd';
import { getPath } from '../../utils';
import './main-content.less';
const FormItem = Form.Item;
const Search = Input.Search;
const formItemLayout = {
  labelCol: {
    span: 9
  },
  wrapperCol: {
    span: 15
  }
};
function gotoLink(link, router) {
  router.push(link);
}
const filter = ({ productInfo, handleSearch }) => {
  const {
    currentOwner,
    type,
    lairageTime,
    fattenedTime,
    days,
    kLairageTime,
    kCondition
  } = productInfo;
  return (
    <div className="table-wrap">
      <p className="title">Animal Info</p>
      <div className="main-table">
        <Row>
          <Col span={6}>
            <FormItem label="Ear Tag No." {...formItemLayout}>
              <Search
                placeholder=""
                onSearch={value => handleSearch(value)}
                enterButton
              />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="Farm" {...formItemLayout}>
              <Input disabled={true} value={currentOwner} />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="Breed" {...formItemLayout}>
              <Input disabled={true} value={type} />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="In-Fence" {...formItemLayout}>
              <Input disabled={true} value={lairageTime} />
            </FormItem>
          </Col>
        </Row>
        <Row>
          <Col span={6}>
            <FormItem label="Out-Fence" {...formItemLayout}>
              <Input disabled={true} value={fattenedTime} />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="Animal Age" {...formItemLayout}>
              <Input disabled={true} value={days} />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="Time" {...formItemLayout}>
              <Input disabled={true} value={kLairageTime} />
            </FormItem>
          </Col>
          <Col span={6}>
            <FormItem label="Pre QRA" {...formItemLayout}>
              <Input disabled={true} value={kCondition} />
            </FormItem>
          </Col>
        </Row>
      </div>
    </div>
  );
};
export default filter;
