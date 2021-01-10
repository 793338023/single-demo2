import { createAction, createAsyncAction } from "typesafe-actions";
import * as actions from "./actionTypes";

export const title = createAction(actions.PG_COMMON_TITLE)<string>();
export const common = createAction(actions.PG_COMMON_TITLE2)<{
  index: number;
  name: string;
}>();

export const asyncCom = createAsyncAction(
  actions.PG_COMMON_TITLE_Q,
  actions.PG_COMMON_TITLE_S,
  actions.PG_COMMON_TITLE_F
)<{}, { code: string }, { message: string }>();
