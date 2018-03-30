import React from 'react';
import { Form, Input } from 'antd';

class TableCell extends React.Component {
  state = {};
  handleBlur() {
    const { onInputChange, index } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    let inputVal = getFieldValue('productId');
    onInputChange(inputVal, index);
  }

  render() {
    const { val, onInputChange } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    return (
      <p>
        {getFieldDecorator('productId', {
          initialValue: val.productId
        })(<Input onBlur={this.handleBlur.bind(this)} />)}
      </p>
    );
  }
}
TableCell = Form.create()(TableCell);
export default TableCell;
