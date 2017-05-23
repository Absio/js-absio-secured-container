import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'
import user from './user';

const ViewerReducer = combineReducers({
    user: user,
    routing: routerReducer
});

export default ViewerReducer;