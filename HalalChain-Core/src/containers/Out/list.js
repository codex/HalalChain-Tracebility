import React from 'react';
import { Table, Icon } from 'antd';

const List = ({ listProps }) => {  
  return (
    <div>
      <p className="title">Approval history</p>
       <Table
        {...listProps}
        // bordered
        scroll={{ x: '1200px' }}
        pagination={false}
        // simple
        rowKey={(record,index) => index}
      /> 
    </div>
  );
};
export default List;
