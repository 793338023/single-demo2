import { getType } from "typesafe-actions";
import { takeLatest, call, put } from "redux-saga/effects";
import * as actions from "../reducers/actions";
import qryInfo from "../services/qryInfo";

function* doFetch(action: ReturnType<typeof actions.asyncCom.request>) {
  try {
    const req = yield call(qryInfo, { ...action.payload });
    const {
      data: { body }
    } = req;
    yield put(actions.asyncCom.success(body));
  } catch (err) {
    yield put(
      actions.asyncCom.failure(err instanceof Error ? err : new Error(err))
    );
  }
}

export default takeLatest(getType(actions.asyncCom.request), doFetch);
