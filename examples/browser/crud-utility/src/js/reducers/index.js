import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux'
import user from './user';
import container from './container'

const ViewerReducer = combineReducers({
    user: user,
    container: container,
    routing: routerReducer
});

export default ViewerReducer;