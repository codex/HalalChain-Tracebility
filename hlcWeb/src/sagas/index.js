import { fork } from 'redux-saga/effects';
import * as user from './user';
import * as come from './come';

export default function* rootSaga() {
  yield [
    fork(user.watchRegisterFlow),
    fork(user.watchLoginFlow),

    fork(come.watchAddCome),
    fork(come.watchGetProductDetail),
    fork(come.watchCommonAjax)
  ];
}
