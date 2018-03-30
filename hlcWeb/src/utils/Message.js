import { message } from 'antd';

message.config({
  top: 100,
  duration: 2
});

const methods = ['success', 'error', 'info', 'warning', 'warn', 'loading'];

const Message = {};

methods.forEach(method => {
  Message[method] = (error, duration, callBack) => {
    if (error.status === 500) {
      console.log(error);
    } else {
      const content = typeof error === 'object' ? error.message : error;
      return message[method](content, duration, callBack);
    }
  };
});

export default Message;
