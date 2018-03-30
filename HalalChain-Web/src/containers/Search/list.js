import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Form, Input, Button, Table, Steps } from 'antd';
import { getPath } from '../../utils';
import './index.less';
import './main-content.less';
import moment from 'moment';
const Search = Input.Search;
const Step = Steps.Step;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 9
  },
  wrapperCol: {
    span: 15
  }
};
const list = ({ listProps, handleSearch, dataSource }) => {
  return (
    <div className="table-wrap">
      <p className="title">Comprehensive Query</p>
      <div className="main-table">
        <Row>
          <Col span={8}>
            <FormItem label="Ear Tag No." {...formItemLayout}>
              <Search
                placeholder=""
                style={{
                  width: '260px'
                }}
                onSearch={value => handleSearch(value)}
                enterButton
              />
            </FormItem>
          </Col>
        </Row>
        {!!dataSource.length && (
          <div>
            <p className="search-title">Query Results</p>
            <div className="search-title-wrap">
              <Row className="search-row">
                <Col span={3}>Time</Col>
                <Col span={3}>Operation</Col>
                <Col span={4}>Location</Col>
                <Col span={3}>IOT Terminals</Col>
                <Col span={7}>Trading ID</Col>
                <Col span={4}>Asset Owner</Col>
              </Row>
            </div>
            <Steps direction="vertical" current={6} status="finish">
              {dataSource.map((item, index) => {
                var org = '';
                if (item.currentOwner == 'breed') {
                  org = 'The Blue Sky Pasture';
                } else if (item.currentOwner == 'butcher') {
                  org = 'The Desert Slaughterhouse';
                } else {
                  org = 'Transporting';
                }
                return (
                  <Step
                    key={index}
                    title={
                      <Row>
                        <Col span={3}>
                          {moment
                            .unix(parseInt(item.txTime))
                            .format('YYYY-MM-DD HH:mm ss')}
                        </Col>
                        <Col span={3}>{item.operation}</Col>
                        <Col span={4}>{item.mapPosition}</Col>
                        <Col span={3}>{item.operator}</Col>
                        <Col span={7}>
                          <p style={{ wordWrap: 'break-word', width: '95%' }}>
                            {item.txId}
                          </p>
                        </Col>
                        <Col span={4}>{org}</Col>
                      </Row>
                    }
                  />
                );
              })}
            </Steps>
          </div>
        )}
      </div>
    </div>
  );
};
export default list;
