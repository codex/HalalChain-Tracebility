import React from 'react';
import { Form, Input } from 'antd';

class TableCell extends React.Component {
  state = {
    isShowEdit: false
  };
  handleEditClick(val) {
    this.setState({
      isShowEdit: true
    });
  }
  handleBlur() {
    const { onInputChange } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    let inputVal = getFieldValue('days');
    this.setState({
      isShowEdit: false
    });
    onInputChange(inputVal);
  }

  render() {
    const { val, onInputChange } = this.props;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { isShowEdit } = this.state;
    return (
      <p>
        {isShowEdit ? (
          getFieldDecorator('days', {
            initialValue: val.days
          })(<Input onBlur={this.handleBlur.bind(this)} />)
        ) : (
          <span onClick={this.handleEditClick.bind(this)}>{val.days}</span>
        )}
      </p>
    );
  }
}
TableCell = Form.create()(TableCell);
export default TableCell;
