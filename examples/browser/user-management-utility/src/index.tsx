import { initialize } from "absio-secured-container";
import { createBrowserHistory } from "history";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { Route, Router } from "react-router";
import { syncHistoryWithStore } from "react-router-redux";
import { applyMiddleware, createStore } from "redux";
import thunk from "redux-thunk";
import App from "./App";
import viewerReducer from "./redux/reducers";
import "./styles/index.css";

initialize(
  "https://sandbox.absio.com",
  "c8b2b4f8-ba18-4baa-9204-8a2d3f3e0b42"
).catch((error: Error) => console.log(error));

const store = createStore(viewerReducer, applyMiddleware(thunk));
const history = syncHistoryWithStore(createBrowserHistory() as any, store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history as any}>
      <Route path="/" component={App} />
    </Router>
  </Provider>,
  document.getElementById("root")
);
