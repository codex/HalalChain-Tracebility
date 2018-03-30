export const types = {
  ADD_COME: 'ADD_COME',
  ADD_COME_SUCCESS: 'ADD_COME_SUCCESS',
  ADD_COME_FAIL: 'ADD_COME_FAIL',

  GET_PRODUCT_DETAIL: 'GET_PRODUCT_DETAIL',
  COMMON_AJAX: 'COMMON_AJAX'
};

export function addCome(payload) {
  return {
    type: types.ADD_COME,
    payload
  };
}

export function getProductDetail(payload) {
  return {
    type: types.GET_PRODUCT_DETAIL,
    payload
  };
}

export function commonAjax(payload) {
  return {
    type: types.COMMON_AJAX,
    payload
  };
}
