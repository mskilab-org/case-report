import { all, takeEvery, put, call, select } from "redux-saga/effects";
import axios from "axios";
import actions from "./actions";
import { getCurrentState } from "./selectors";

function* fetchData(action) {
  try {
    const currentState = yield select(getCurrentState);
    const { id } = currentState.CaseReport;

    let responseGenomeData = yield call(axios.get, `data/${id}/complex.json`);

    let data = responseGenomeData.data || {
      settings: {},
      intervals: [],
      connections: [],
    };
    yield put({
      type: actions.FETCH_GENOME_DATA_SUCCESS,
      data,
    });
  } catch (error) {
    yield put({
      type: actions.FETCH_GENOME_DATA_FAILED,
      error,
    });
  }
}

function* actionWatcher() {
  yield takeEvery(actions.FETCH_GENOME_DATA_REQUEST, fetchData);
}
export default function* rootSaga() {
  yield all([actionWatcher()]);
}
