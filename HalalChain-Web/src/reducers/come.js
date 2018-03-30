import { types } from '../actions/come';

const initialState = {
  loaded: false
};

export default function user(state = initialState, action = {}) {
  const { payload } = action;
  switch (action.type) {
    case 'RESET_STATE':
      return {
        ...initialState
      };

    case types.ADD_COME:
      return {
        ...state,
        loggingIn: true,
        loginError: null
      };

    case types.ADD_COME_SUCCESS:
      return {
        ...state,
        user: payload,
        loggingIn: false
      };

    case types.ADD_COME_FAIL:
      return {
        ...state,
        loggingIn: false,
        loginError: action.error
      };
    default:
      return state;
  }
}
