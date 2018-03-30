import React from 'react';
import { Table, Icon } from 'antd';

const List = ({ listProps }) => {  
  return (
    <div>
      {/* <p className="title">审批记录</p> */}
       <Table
        {...listProps}
        // bordered
        scroll={{ x: 1300 }}
        pagination={false}
        // simple
        rowKey={(record,index) => index}
      /> 
    </div>
  );
};
export default List;
