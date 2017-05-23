import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router, Route } from 'react-router';
import { createBrowserHistory } from 'history';
import { applyMiddleware, createStore } from 'redux';
import { syncHistoryWithStore } from 'react-router-redux'
import { initialize } from 'absio-secured-container';
import thunk from 'redux-thunk';
import viewerReducer from './js/reducers';
import App from './js/App';
import './css/index.css';

initialize('https://sandbox.absio.com', '89df1450-458e-4d43-bf42-5c700a4648ce')
    .catch((error) => console.log(error));

const store = createStore(viewerReducer, applyMiddleware(thunk));
const history = syncHistoryWithStore(createBrowserHistory(), store);

ReactDOM.render(
    <Provider store={store}>
        <Router history = {history}>
            <Route path="/" component={App}/>
        </Router>
    </Provider>,
    document.getElementById('root')
);
