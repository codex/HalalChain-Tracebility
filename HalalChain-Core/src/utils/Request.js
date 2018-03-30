import superagent from 'superagent';
import configs from '../configs';
import Storage from '../utils/Storage';
import { formatUrl } from '../utils';

const methods = ['get', 'post', 'put', 'patch', 'del'];

const RESULT_CODE = {
  SUCCESS: true,
  UNAUTHORIZED: 5004
};

class ApiClient {

  constructor() {
    methods.forEach(method =>
      this[method] = (path, {
        params,
        data,
        formEncoding,
        formJson,
        auth,
        sign,
        handleError
      } = {}) => new Promise((resolve, reject) => {
        const request = superagent[method](formatUrl(path));
        let query = params;
        if (method === 'get') {
          query = {
            ...params,
            t: new Date().getTime()
          };
        }
        if (query) {
          request.query(query);
        }
        request.timeout(30000);
        if (data) {
          // 当前MVP sign不需要
          if (sign && !data.sign) {
            data.sign = '123';
          }
          request.send(data);
        }

        if (formEncoding) {
          request.set('Content-Type', 'application/x-www-form-urlencoded');
        }
        if (formJson) {
          request.set('Content-Type', 'application/json');
          request.set('Accept', 'application/json');
        }

        if (auth) {
          const user = Storage.get(configs.authToken);
          if (user) {
            request.set('Authorization', user.token);
          } else {
            window.location.href = '/login';
            // reject(new Error('token不存在或已过期'));
          }
        }

        request.end((err, { body } = {}) => {
          if (err) {
            if (typeof err.status === 'undefined' && err.message.indexOf('Request has been terminated') > -1) {
              reject(new Error('网络不给力,请刷新页面'));
            }
            if (err.timeout) {
              reject(new Error('请求超时,请刷新页面'));
            } else {
              reject(body || err);
            }
          } else {
            if (sign) {
              body.json = JSON.parse(body.json);
            }
            const res = sign ? body.json : body;
            if (res.success === RESULT_CODE.SUCCESS) {
              resolve(res);
            // } else if (res.code === RESULT_CODE.UNAUTHORIZED) {
            //   window.location.href = '/login';
            } else if (handleError) {
              reject(res);
            } else {
              reject(new Error(res.msg));
            }
          }
        });
      })
    );
  }
}

export default ApiClient;
