import { put, take, call, fork, select } from 'redux-saga/effects';
import _ from 'lodash';
import { types } from '../actions/come';
import Message from '../utils/Message';
import Request from '../utils/Request';
import { selectUser, selectCategory } from '../utils/saga';
import { isApprovedMerchant } from '../utils';

function* addCome(payload = {}) {
  const { data, success, fail } = payload;
  try {
    const result = yield call(
      new Request().post,
      'channels/mychannel/chaincodes/hlccc',
      {
        data,
        auth: true,
        params: {}
      }
    );
    if (result.success) {
      yield put({
        type: types.ADD_COME_SUCCESS,
        payload: {
          data: result
        }
      });
      if (payload.success) {
        yield call(payload.success, result);
      }
    } else {
      if (payload.fail) {
        yield call(payload.fail, result);
      }
    }
    return result;
  } catch (error) {
    Message.error('Request timeout');
    if (payload.fail) {
      yield call(payload.fail);
    }
  }
}

function* getProductDetail(payload = {}) {
  const { data, success, fail } = payload;
  try {
    const result = yield call(
      new Request().post,
      'query/channels/mychannel/chaincodes/hlccc',
      {
        data,
        auth: true,
        params: {}
      }
    );
    if (result.success) {
      if (payload.success) {
        yield call(payload.success, result);
      }
    } else {
      if (payload.fail) {
        yield call(payload.fail, result);
      }
    }
    return result;
  } catch (e) {
    Message.error('Request timeout');
    // if (payload.fail) {
    //   yield call(payload.fail);
    // }
  }
}

function* commonAjax(payload = {}) {
  const { data, success, fail } = payload;
  try {
    const result = yield call(
      new Request().post,
      'channels/mychannel/chaincodes/hlccc',
      {
        data,
        auth: true,
        params: {}
      }
    );
    if (result.success) {
      if (payload.success) {
        yield call(payload.success, result);
      }
    } else {
      if (payload.fail) {
        yield call(payload.fail, result);
      }
    }
    return result;
  } catch (error) {
    // Message.error('Request timeout');
    if (payload.fail) {
      yield call(payload.fail);
    }
  }
}

export function* watchAddCome() {
  while (true) {
    const { payload } = yield take(types.ADD_COME);
    yield fork(addCome, payload);
  }
}

export function* watchGetProductDetail() {
  while (true) {
    const { payload } = yield take(types.GET_PRODUCT_DETAIL);
    yield fork(getProductDetail, payload);
  }
}

export function* watchCommonAjax() {
  while (true) {
    const { payload } = yield take(types.COMMON_AJAX);
    yield fork(commonAjax, payload);
  }
}
