// Borrowed from https://gist.github.com/hoschi/6538249ad079116840825e20c48f1690
// Note that reloading sagas has several issues/caveats to be aware of.
// See https://github.com/yelouafi/redux-saga/issues/22#issuecomment-218737951 for discussion.

import { take, fork, cancel, all } from "redux-saga/effects";

import commonSaga from "./index";

function* rootSaga() {
  yield all([...commonSaga]);
}

export const CANCEL_SAGAS_HMR = "CANCEL_SAGAS_HMR";

function createAbortableSaga(saga: any) {
  if (process.env.NODE_ENV === "development") {
    return function* main() {
      const sagaTask = yield fork(saga);

      yield take(CANCEL_SAGAS_HMR);
      yield cancel(sagaTask);
    };
  } else {
    return saga;
  }
}

class SagaManager {
  private sagas: any[] = [];
  private sagaTasks: any[] = [];
  replace(ns: any[] = []) {
    this.sagas = [...ns, rootSaga];
    return this;
  }
  startSagas(sagaMiddleware: any) {
    this.sagaTasks.map(sagaTask => {
      sagaTask.cancel();
    });
    this.sagaTasks = this.sagas
      .map(createAbortableSaga)
      .map(saga => sagaMiddleware.run(saga));
  }
  cancelSagas(store: any) {
    store.dispatch({
      type: CANCEL_SAGAS_HMR
    });
  }
}

export default new SagaManager();
