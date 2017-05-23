
import { childViewNames, actionTypes } from '../constants';

const initialState = {
    userId : null,
    childName: childViewNames.login,
    error: null,
    loading: false,
    reminder:'',
    containers:[]
};

const user = (state, action) => {
    if (typeof state === 'undefined') {
        return initialState;
    }
    switch (action.type) {
        case actionTypes.START_LOADING:
            return Object.assign({}, state, {loading: true, error: null});
        case actionTypes.STOP_LOADING:
            return Object.assign({}, state, {loading: false});
        case actionTypes.ERROR_OCCURRED:
            return Object.assign({}, state, {error: action.error});
        case actionTypes.LOGIN_COMPLETED:
            return Object.assign({}, state, {childName:childViewNames.mainGridView, reminder : action.reminder, userId: action.id });
        case actionTypes.SHOW_LOGIN_VIEW:
            return Object.assign({}, state, { childName: childViewNames.login });
        case actionTypes.CONTAINERS_ARRAY_UPDATED:
            return Object.assign({}, state, { containers: action.containers });
        case actionTypes.CLEAN_ERROR:
            return Object.assign({}, state, { error: null });
        default:
            return state;
    }
};

export default user;