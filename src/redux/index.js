import { createStore, applyMiddleware, combineReducers } from "redux";
import thunk from "redux-thunk";
import logger from "redux-logger";

import gps from "./modules/gps";

const middlewares = [thunk];

if (__DEV__) {
  middlewares.push(logger);
}
const middleware = applyMiddleware(...middlewares);

const reducer = combineReducers({
  gps
});

const store = createStore(reducer, middleware);

export default store;
