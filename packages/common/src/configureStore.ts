// from https://gist.github.com/markerikson/dc6cee36b5b6f8d718f2e24a249e0491#file-configurestore-js
import { createStore, applyMiddleware, compose, combineReducers } from "redux";
import createSagaMiddleware from "redux-saga";
import rootReducer from "./reducers";
import SagaManager from "./sagas/SagaManager";

/**
 * Based on the current environment variable, we need to make sure
 * to exclude any DevTools-related code from the production builds.
 * The code is envify'd - using 'DefinePlugin' in Webpack.
 */

const sagaMiddleware = createSagaMiddleware();

const middlewares = [sagaMiddleware];

const isDev = process.env.NODE_ENV === "development";

if (isDev) {
  const { logger } = require("redux-logger");
  middlewares.push(logger);
}

let storeEnhancers: any = [];
let composeEnhancers: any;

try {
  if (isDev) {
    if ((window as any).devToolsExtension) {
      storeEnhancers.push((window as any).devToolsExtension());
    }
    composeEnhancers =
      isDev && (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
        ? (window as any).__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
            trace: true,
            traceLimit: 25,
            shouldHotReload: false
          })
        : compose;
  }
} catch (err) {
  alert(err);
}

export const GLOBAL_REDUCER = "golobalCommon";

export const staticReducers = {
  staticCommon(state = "", action: { type: string; payload?: any }): string {
    switch (action.type) {
      case "CREATEACCOUNT_CLEAR": {
        return "createaccount_clear";
      }
      default:
        return state;
    }
  },
  [GLOBAL_REDUCER]: rootReducer
};

const configureStore = (function() {
  let store: ReturnType<typeof createStore>;
  return {
    create(initialState = {}) {
      store = createStore(
        combineReducers(staticReducers),
        initialState,
        composeEnhancers(applyMiddleware(...middlewares))
      );
      // run sagas
      SagaManager.startSagas(sagaMiddleware);
      if (isDev) {
        if (module.hot) {
          // module.hot.accept("../reducers/rootReducer", () =>
          //   store.replaceReducer(require("../reducers/rootReducer").default)
          // );
          // module.hot.accept("../sagas/SagaManager", () => {
          //   SagaManager.cancelSagas(store);
          //   require("../sagas/SagaManager").default.startSagas(sagaMiddleware);
          // });
        }
      }
      return store;
    },
    replace(reducer: any, sagas?: any) {
      store.replaceReducer(reducer);
      SagaManager.replace(sagas).startSagas(sagaMiddleware);
    },
    reset(action?: { type: string }) {
      action && store.dispatch(action);
      this.replace(staticReducers, []);
    }
  };
})();

export default configureStore;
