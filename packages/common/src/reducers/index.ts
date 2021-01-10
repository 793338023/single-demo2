import { ActionType, getType } from "typesafe-actions";
import * as actions from "./actions";

// 注册的方法获取对应action值，根据actions里的方法名获取
type PFc<P extends ActionKeys> = FuctionReducer<P>;
type ActionKeys = keyof typeof actions;
type PState = NonNullable<Parameters<typeof reducer>[0]>;
interface FuctionReducer<T extends ActionKeys> {
  (s: PState, a: ActionType<Pick<typeof actions, T>>): CommonReducer;
}

// 定义reducer的state数据类型
export interface CommonReducer {
  title: string;
  common: { index: number; name: string };
  [key: string]: any;
}

// 默认state
const initState = {
  title: "init",
  common: { index: 0, name: "" }
};

/***************注册方法，action对应的state处理函数********************** */

const makeTitle: PFc<"title"> = function(state, action) {
  return { ...state, title: action.payload };
};

const makeCommon: PFc<"common"> = function(state, action) {
  return { ...state, title2: action.payload };
};

const makeAsync: PFc<"asyncCom"> = function(state, action) {
  switch (action.type) {
    case getType(actions.asyncCom.request): {
      return { ...state, asyncCom: action.payload };
    }
    case getType(actions.asyncCom.success): {
      return { ...state, asyncCom: action.payload };
    }
    case getType(actions.asyncCom.failure): {
      return { ...state, asyncCom: action.payload };
    }
  }
};

/************************************* */

let MAP_REDUCER: {
  [key: string]: PFc<any>;
} = {};

// 注册type对应reducer的处理state方法
MAP_REDUCER[getType(actions.title)] = makeTitle;
MAP_REDUCER[getType(actions.common)] = makeCommon;
MAP_REDUCER[getType(actions.asyncCom.request)] = makeAsync;
MAP_REDUCER[getType(actions.asyncCom.success)] = makeAsync;
MAP_REDUCER[getType(actions.asyncCom.failure)] = makeAsync;

export default function reducer(
  state = initState,
  action: ActionType<typeof actions>
): CommonReducer {
  const { type } = action;
  if (MAP_REDUCER.hasOwnProperty(type)) {
    return MAP_REDUCER[type](state, action);
  }
  return state;
}
