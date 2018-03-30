import Request from './Request';

export function testPhone(phone) {
  return /^1(3|5|7|8|4)\d{9}$/.test(phone);
}

export function validFloatPrecision(rule, value, callback) {
  if (/^\d*(\.\d{1,2})?$/.test(value)) {
    callback();
  } else {
    callback(new Error('最多保留2位小数'));
  }
}

export function validPhone(rule, value, callback) {
  if (!/^1(3|5|7|8|4)\d{9}$/.test(value)) {
    callback(new Error('请输入正确的手机号码'));
  } else {
    callback();
  }
}

export async function validIsExistPhone(rule, value, callback) {
  if (!/^1(3|5|7|8|4)\d{9}$/.test(value)) {
    callback(new Error('请输入正确的手机号码'));
  } else {
    callback();
    // try {
    //   await new Request().post('user/checkTel', {
    //     auth: false,
    //     formEncoding: true,
    //     data: {
    //       telephone: value
    //     }
    //   });
    //   callback();
    // } catch (error) {
    //   callback(new Error('手机号已存在'));
    // }
  }
}

export async function validNotExistPhone(rule, value, callback) {
  if (!/^1(3|5|7|8|4)\d{9}$/.test(value)) {
    callback(new Error('请输入正确的手机号码'));
  } else {
    try {
      await new Request().post('user/checkTel', {
        auth: false,
        formEncoding: true,
        data: {
          telephone: value
        }
      });
      callback(new Error('该手机号不存在'));
    } catch (error) {
      callback();
    }
  }
}

export function getValidErrorMessage(err) {
  if (!err) {
    return null;
  }
  return err[Object.keys(err)[0]].errors[0].message;
}

