import { put, take, call, fork, select } from 'redux-saga/effects';
// import sha256 from 'crypto-js/sha256';
// import Base64 from 'crypto-js/enc-base64';
import configs from '../configs';
import { types } from '../actions/user';
import Request from '../utils/Request';
import Storage from '../utils/Storage';
import Message from '../utils/Message';
import { selectUser } from '../utils/saga';
import USERTYPE from '../configs/userType';
import _ from 'lodash';

function* login(payload) {
  const { data, success, fail } = payload;
  try {
    // data.loginPassword = Base64.stringify(sha256(data.loginPassword));
    const result = yield call(new Request().post, 'login', {
      data,
      // formEncoding: true,
      auth: false
    });
    let userInfo = {};
    userInfo.token = 'Bearer ' + result.token;
    userInfo.orgName = data.orgName;
    Storage.set(configs.authToken, userInfo, 60 * 24 * 365);
    yield put({ type: types.LOGIN_SUCCESS, payload: userInfo });
    if (success) {
      yield call(success, userInfo);
    }
    // return token;
  } catch (error) {
    if (fail) {
      yield call(fail, error);
    }
  }
}

function* logout(payload) {
  Storage.remove(configs.authToken);
  yield put({ type: 'RESET_STATE' });
  if (payload.success) {
    yield call(payload.success);
  }
}

function* verificationCode(payload) {
  const { success } = payload;
  try {
    // TODO POST account/verification  {telephone,type 验证码类型: 0(注册) 1(登录) 2(修改密码)}
    yield call(new Request().post, 'user/sms', {
      data: payload,
      auth: false,
      formEncoding: true
    });
    if (success) {
      yield call(success);
    }
  } catch (error) {
    Message.error(error);
  }
}

function* getCaptCha(payload) {
  try {
    // TODO Get image/captcha  {refresh}
    const re = yield call(new Request().get, 'image/captcha', {
      params: payload,
      auth: false
    });
    yield put({ type: types.GET_CAPT_CHA_SUCCESS, payload: re });
  } catch (error) {
    Message.error(error);
  }
}

function* register(payload) {
  const { success, fail, data } = payload;
  try {
    // data.password = Base64.stringify(sha256(data.password));
    const re = yield call(new Request().post, 'mychannel/chaincodes/hlccc', {
      data,
      auth: false,
      formEncoding: true
    });

    yield put({ type: types.REGISTER_SUCCESS, payload: re });
    yield call(success);
  } catch (error) {
    Message.error(error);
  }
}

function* refuseInvite(payload) {
  const { success, fail, data } = payload;
  try {
    yield call(new Request().post, 'user/refuseInvitation', {
      data,
      formEncoding: true,
      auth: true
    });
    yield put({
      type: types.REFUSE_INVITE_SUCCESS
    });
    if (success) {
      yield call(success);
    }
  } catch (error) {
    if (fail) {
      yield call(fail);
    }
    Message.error(error);
  }
}

function* acceptInvite(payload) {
  const { success, fail, data } = payload;
  try {
    const user = yield select(selectUser);
    const result = yield call(new Request().post, 'user/acceptInvitation', {
      auth: true,
      data,
      formEncoding: true
    });
    const userInfo = {
      ...user,
      ...result,
      userStatus: 1
    };
    Storage.set(configs.authToken, userInfo, 60 * 24 * 365);
    yield put({
      type: types.ACCEPT_INVITE_SUCCESS,
      payload: userInfo
    });
    if (success) {
      yield call(success);
    }
  } catch (error) {
    if (fail) {
      yield call(fail);
    }
    Message.error(error);
  }
}

function* resetPassword(payload) {
  const { success, fail, data } = payload;
  try {
    // data.newPassword = Base64.stringify(sha256(data.newPassword));
    const { isInvited, inviteInfo, token, userInfo } = yield call(
      new Request().post,
      'user/forgetPassword',
      {
        data,
        formEncoding: true,
        auth: false
      }
    );
    userInfo.token = token;
    Storage.set(configs.authToken, userInfo, 60 * 24 * 365);
    yield put({ type: types.FORGET_PASSWORD_SUCCESS, payload: userInfo });
    if (isInvited) {
      yield call(fail, inviteInfo, isInvited);
    } else if (success) {
      yield call(success);
    }
  } catch (error) {
    if (fail) {
      yield call(fail, error);
    }
  }
}

function* insertBasicInfo(payload) {
  const { success, fail, data } = payload;
  try {
    const user = yield select(selectUser);
    const token = yield call(new Request().post, 'user/insertBasicInfo', {
      auth: true,
      data,
      formEncoding: true
    });
    const userInfo = {
      ...user,
      token,
      userType: data.userType,
      userStatus: 0
    };
    Storage.set(configs.authToken, userInfo, 60 * 24 * 365);
    yield put({ type: types.INSERT_BASIC_INFO_SUCCESS, payload: userInfo });
    if (success) {
      yield call(success);
    }
  } catch (error) {
    yield put({ type: types.INSERT_BASIC_INFO_FAIL });
    if (fail) {
      yield call(fail);
    }
    Message.error(error);
  }
}

function* updateBasicInfo(payload) {
  const { success, fail, data, userType } = payload;
  const url =
    userType === USERTYPE.FACTORY
      ? 'user/updateCompanyInfo'
      : 'user/updateMerchantInfo';
  try {
    const user = yield select(selectUser);
    yield call(new Request().post, url, {
      auth: true,
      data,
      formEncoding: true
    });
    const userInfo = {
      ...user,
      userStatus: 0
    };
    Storage.set(configs.authToken, userInfo, 60 * 24 * 365);
    yield put({ type: types.UPDATE_BASIC_INFO_SUCCESS, payload: userInfo });
    if (success) {
      yield call(success);
    }
  } catch (error) {
    yield put({ type: types.UPDATE_BASIC_INFO_FAIL });
    if (fail) {
      yield call(fail);
    }
    Message.error(error);
  }
}

function* getBasicInfo(payload) {
  const { success, fail, userType } = payload;
  const url =
    userType === USERTYPE.FACTORY
      ? 'user/queryCompanyInfo'
      : 'user/queryMerchantInfo';
  try {
    const result = yield call(new Request().post, url, {
      auth: true,
      formEncoding: true
    });
    yield put({ type: types.GET_BASIC_INFO_SUCCESS, payload: result });
    if (success) {
      yield call(success);
    }
  } catch (error) {
    Message.error(error);
    yield put({ type: types.GET_BASIC_INFO_FAIL });
    if (fail) {
      yield call(fail);
    }
  }
}

function* changeCellPhone(payload) {
  const { success, fail, data } = payload;
  try {
    const { isInvited, inviteInfo, token, userInfo } = yield call(
      new Request().post,
      'user/changeCellphone',
      {
        data,
        formEncoding: true,
        auth: true
      }
    );
    userInfo.token = token;
    userInfo.orgName = data.orgName;
    Storage.set(configs.authToken, userInfo, 60 * 24 * 365);
    yield put({ type: types.CHANGE_CELLPHONE_SUCCESS, payload: userInfo });
    if (isInvited) {
      yield call(fail, inviteInfo, isInvited);
    } else if (success) {
      yield call(success);
    }
  } catch (error) {
    Message.error(error);
    yield put({ type: types.CHANGE_CELLPHONE_FAIL });
    if (fail) {
      yield call(fail);
    }
  }
}

export function* watchLoginFlow() {
  while (true) {
    const { payload } = yield take(types.LOGIN);
    yield fork(login, payload);
  }
}

export function* watchLogoutFlow() {
  while (true) {
    const { payload } = yield take(types.LOGOUT);
    yield fork(logout, payload);
  }
}

export function* watchVerificationCodeFlow() {
  while (true) {
    const { payload } = yield take(types.VERIFICATION_CODE);
    yield fork(verificationCode, payload);
  }
}

export function* watchRegisterFlow() {
  while (true) {
    const { payload } = yield take(types.REGISTER);
    yield fork(register, payload);
  }
}

export function* watchAcceptInviteFlow() {
  while (true) {
    const { payload } = yield take(types.ACCEPT_INVITE);
    yield fork(acceptInvite, payload);
  }
}

export function* watchRefuseInviteFlow() {
  while (true) {
    const { payload } = yield take(types.REFUSE_INVITE);
    yield fork(refuseInvite, payload);
  }
}

export function* watchResetPasswordFlow() {
  while (true) {
    const { payload } = yield take(types.FORGET_PASSWORD);
    yield fork(resetPassword, payload);
  }
}

export function* watchFindNextLevelArea() {
  while (true) {
    const { payload } = yield take(types.FIND_NEXT_LEVEL_AREA);
    yield fork(findNextLevelArea, payload);
  }
}

export function* watchInsertBasicInfo() {
  while (true) {
    const { payload } = yield take(types.INSERT_BASIC_INFO);
    yield fork(insertBasicInfo, payload);
  }
}

export function* watchUpdateBasicInfo() {
  while (true) {
    const { payload } = yield take(types.UPDATE_BASIC_INFO);
    yield fork(updateBasicInfo, payload);
  }
}

export function* watchGetBasicInfo() {
  while (true) {
    const { payload } = yield take(types.GET_BASIC_INFO);
    yield fork(getBasicInfo, payload);
  }
}

export function* watchChangeCellPhone() {
  while (true) {
    const { payload } = yield take(types.CHANGE_CELLPHONE);
    yield fork(changeCellPhone, payload);
  }
}

export function* watchGetCaptCha() {
  while (true) {
    const { payload } = yield take(types.GET_CAPT_CHA);
    yield fork(getCaptCha, payload);
  }
}
