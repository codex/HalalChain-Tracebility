import { types } from '../actions/user';

const initialState = {
  areaOption: [],
  captChaImg: '',
  loaded: false,
  insertingLoading: false
};

export default function user(state = initialState, action = {}) {
  const { payload } = action;
  switch (action.type) {
    case 'RESET_STATE':
      return {
        ...initialState
      };

    case types.LOGIN:
      return {
        ...state,
        loggingIn: true,
        loginError: null
      };

    case types.LOGIN_SUCCESS:
      return {
        ...state,
        user: payload,
        loggingIn: false
      };

    case types.LOGIN_FAIL:
      return {
        ...state,
        loggingIn: false,
        loginError: action.error
      };

    case types.LOGOUT:
      return {
        ...state,
        user: null
      };

    case types.REGISTER:
      return {
        ...state,
        registering: true
      };

    case types.REGISTER_SUCCESS:
      return {
        ...state,
        user: payload,
        registering: false
      };

    case types.REGISTER_FAIL:
      return {
        ...state,
        registering: false
      };

    case types.ACCEPT_INVITE:
      return {
        ...state,
        acceptInviting: true
      };

    case types.ACCEPT_INVITE_SUCCESS:
      return {
        ...state,
        user: payload,
        acceptInviting: false
      };

    case types.ACCEPT_INVITE_FAIL:
      return {
        ...state,
        acceptInviting: false
      };

    case types.REFUSE_INVITE:
      return {
        ...state,
        refuseInviting: true
      };

    case types.REFUSE_INVITE_SUCCESS:
      return {
        ...state,
        refuseInviting: false
      };

    case types.REFUSE_INVITE_FAIL:
      return {
        ...state,
        refuseInviting: false
      };

    case types.VERIFICATION_CODE:
      return {
        ...state,
        verificating: true
      };

    case types.VERIFICATION_CODE_SUCCESS:
      return {
        ...state,
        verificating: false
      };

    case types.VERIFICATION_CODE_FAIL:
      return {
        ...state,
        verificating: false
      };

    case types.FIND_NEXT_LEVEL_AREA:
      return {
        ...state,
        findingArea: true
      };

    case types.FIND_NEXT_LEVEL_AREA_SUCCESS:
      return {
        ...state,
        areaOption: payload.areaOption,
        findingArea: false
      };

    case types.FIND_NEXT_LEVEL_AREA_FAIL:
      return {
        ...state,
        findingArea: false
      };

    case types.INSERT_BASIC_INFO:
      return {
        ...state,
        inserting: true
      };

    case types.INSERT_BASIC_INFO_SUCCESS:
      return {
        ...state,
        user: payload,
        inserting: false
      };

    case types.INSERT_BASIC_INFO_FAIL:
      return {
        ...state,
        inserting: false
      };

    case types.FORGET_PASSWORD:
      return {
        ...state,
        forgetting: true
      };

    case types.FORGET_PASSWORD_SUCCESS:
      return {
        ...state,
        user: payload,
        forgetting: false
      };

    case types.FORGET_PASSWORD_FAIL:
      return {
        ...state,
        forgetting: false
      };

    case types.UPDATE_BASIC_INFO:
      return {
        ...state,
        insertingLoading: true
      };

    case types.UPDATE_BASIC_INFO_SUCCESS:
      return {
        ...state,
        user: payload,
        insertingLoading: false
      };

    case types.UPDATE_BASIC_INFO_FAIL:
      return {
        ...state,
        insertingLoading: false
      };

    case types.GET_BASIC_INFO:
      return {
        ...state,
        insertingLoading: true
      };

    case types.GET_BASIC_INFO_SUCCESS:
      return {
        ...state,
        basicInfo: payload,
        insertingLoading: false
      };

    case types.GET_BASIC_INFO_FAIL:
      return {
        ...state,
        insertingLoading: false
      };

    case types.CHANGE_CELLPHONE:
      return {
        ...state,
        changeTelLoading: true
      };

    case types.CHANGE_CELLPHONE_SUCCESS:
      return {
        ...state,
        user: payload,
        changeTelLoading: false
      };

    case types.CHANGE_CELLPHONE_FAIL:
      return {
        ...state,
        changeTelLoading: false
      };

      case types.GET_CAPT_CHA_SUCCESS:
      return {
        ...state,
        captChaImg: payload.url,
      };
    default:
      return state;
  }
}
