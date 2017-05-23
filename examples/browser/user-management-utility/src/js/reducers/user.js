
import { childViewNames, actionTypes } from '../constants';

const initialState = {
    userId : null,
    childName: childViewNames.login,
    error: null,
    loading: false,
    reminder:'',
    passwordChanged : false,
    backupChanged: false
};

const mainView = (state, action) => {
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
        case actionTypes.SHOW_REGISTER_VIEW:
            return Object.assign({}, state, {childName: childViewNames.register, error: null});
        case actionTypes.USER_REGISTERED_SUCCESSFULLY:
            return Object.assign({}, state, { userId : action.userId });
        case actionTypes.SHOW_RESET_PASSWORD_VIEW:
            return Object.assign({}, state, {childName: childViewNames.resetPassword, error: null});
        case actionTypes.LOGIN_COMPLETED:
            return Object.assign({}, state, {childName:childViewNames.tabView, reminder : action.reminder, userId: action.id });
        case actionTypes.RESET_STATE_FOR_CREDENTIALS:
            return Object.assign({}, state, { passwordChanged : false, backupChanged : false, error: null });
        case actionTypes.BACKUP_CREDENTIALS_CHANGED_SUCCESSFULLY:
            return Object.assign({}, state, { backupChanged : true });
        case actionTypes.PASSWORD_CHANGED_SUCCESSFULLY:
            return Object.assign({}, state, { passwordChanged : true });
        case actionTypes.PASSWORD_RESTORED_SUCCESSFULLY:
            return Object.assign({}, state, { userId : action.userId });
        case actionTypes.SHOW_LOGIN_VIEW:
            return Object.assign({}, state, { childName: childViewNames.login });
        case actionTypes.DELETE_USER_DATA:
            return initialState;
        default:
            return state;
    }
};

export default mainView;