export const types = {
  REGISTER: 'REGISTER',
  REGISTER_SUCCESS: 'REGISTER_SUCCESS',
  REGISTER_FAIL: 'REGISTER_FAIL',

  ACCEPT_INVITE: 'ACCEPT_INVITE',
  ACCEPT_INVITE_SUCCESS: 'ACCEPT_INVITE_SUCCESS',
  ACCEPT_INVITE_FAIL: 'ACCEPT_INVITE_FAIL',

  REFUSE_INVITE: 'REFUSE_INVITE',
  REFUSE_INVITE_SUCCESS: 'REFUSE_INVITE_SUCCESS',
  REFUSE_INVITE_FAIL: 'REFUSE_INVITE_FAIL',

  LOGIN: 'LOGIN',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGIN_FAIL: 'LOGIN_FAIL',
  LOGOUT: 'LOGOUT',

  VERIFICATION_CODE: 'VERIFICATION_CODE',
  VERIFICATION_CODE_SUCCESS: 'VERIFICATION_CODE_SUCCESS',
  VERIFICATION_CODE_FAIL: 'VERIFICATION_CODE_FAIL',

  GET_USER_DETAIL:'GET_USER_DETAIL',
  GET_USER_DETAIL_SUCCESS:'GET_USER_DETAIL_SUCCESS',
  GET_USER_DETAIL_FAIL:'GET_USER_DETAIL_FAIL',


  INSERT_BASIC_INFO: 'INSERT_BASIC_INFO',
  INSERT_BASIC_INFO_SUCCESS: 'INSERT_BASIC_INFO_SUCCESS',
  INSERT_BASIC_INFO_FAIL: 'INSERT_BASIC_INFO_FAIL',

  FORGET_PASSWORD: 'FORGET_PASSWORD',
  FORGET_PASSWORD_SUCCESS: 'FORGET_PASSWORD_SUCCESS',
  FORGET_PASSWORD_FAIL: 'FORGET_PASSWORD_FAIL',

  UPDATE_BASIC_INFO: 'UPDATE_BASIC_INFO',
  UPDATE_BASIC_INFO_SUCCESS: 'UPDATE_BASIC_INFO_SUCCESS',
  UPDATE_BASIC_INFO_FAIL: 'UPDATE_BASIC_INFO_FAIL',

  GET_BASIC_INFO: 'GET_BASIC_INFO',
  GET_BASIC_INFO_SUCCESS: 'GET_BASIC_INFO_SUCCESS',
  GET_BASIC_INFO_FAIL: 'GET_BASIC_INFO_FAIL',

  CHANGE_CELLPHONE: 'CHANGE_CELLPHONE',
  CHANGE_CELLPHONE_SUCCESS: 'CHANGE_CELLPHONE_SUCCESS',
  CHANGE_CELLPHONE_FAIL: 'CHANGE_CELLPHONE_FAIL',

  GET_CAPT_CHA:'GET_CAPT_CHA',
  GET_CAPT_CHA_SUCCESS:'GET_CAPT_CHA_SUCCESS',
  GET_CAPT_CHA_FAIL:'GET_CAPT_CHA_FAIL'
};

export function register(payload) {
  return {
    type: types.REGISTER,
    payload
  };
}

export function acceptInvite(payload) {
  return {
    type: types.ACCEPT_INVITE,
    payload
  };
}

export function refuseInvite(payload) {
  return {
    type: types.REFUSE_INVITE,
    payload
  };
}

export function verificationCode(payload) {
  return {
    type: types.VERIFICATION_CODE,
    payload
  };
}

export function login(payload) {
  return {
    type: types.LOGIN,
    payload
  };
}

export function logout(payload) {
  return {
    type: types.LOGOUT,
    payload
  };
}

export function checkTel(payload) {
  return {
    type: types.CHECK_TEL,
    payload
  };
}

export function findNextLevelArea(payload) {
  return {
    type: types.FIND_NEXT_LEVEL_AREA,
    payload
  };
}

export function forgetPassword(payload) {
  return {
    type: types.FORGET_PASSWORD,
    payload
  };
}

export function insertBasicInfo(payload) {
  return {
    type: types.INSERT_BASIC_INFO,
    payload
  };
}

export function updateBasicInfo(payload) {
  return {
    type: types.UPDATE_BASIC_INFO,
    payload
  };
}

export function getBasicInfo(payload) {
  return {
    type: types.GET_BASIC_INFO,
    payload
  };
}

export function changeCellphone(payload) {
  return {
    type: types.CHANGE_CELLPHONE,
    payload
  };
}

export function getCaptCha(payload) {
  return {
    type: types.GET_CAPT_CHA,
    payload
  };
}
