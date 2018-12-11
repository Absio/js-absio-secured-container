import {actionTypes} from './constants';
import {
    register,
    logIn,
    getBackupReminder,
    changeCredentials,
    needToSyncAccount,
    synchronizeAccount,
    deleteUser,
    logOut
} from 'absio-secured-container';


export const login = (id, password, passphrase, cacheLocal) => {
    return async (dispatch, getState) => {

        dispatch({type: actionTypes.START_LOADING});

        try {
            const reminder = await getBackupReminder(id);
            await logIn(id.trim(), password, passphrase, {cacheLocal});

            dispatch({type: actionTypes.LOGIN_COMPLETED, reminder, id});
        }
        catch (error) {
            console.log(error.message);
            dispatch({type: actionTypes.ERROR_OCCURRED, error: {message: error.message}});
        }

        dispatch({type: actionTypes.STOP_LOADING});
    };
};

export const showResetPassword = () => {
    return async (dispatch, getState) => {
        dispatch({type: actionTypes.SHOW_RESET_PASSWORD_VIEW})
    };
};

export const showRegisterView = () => {
    return async (dispatch, getState) => {
        dispatch({type: actionTypes.SHOW_REGISTER_VIEW})
    };
};

export const registerNewUser = (password, reminder, passphrase) => {
    return async (dispatch, getState) => {
        dispatch({type: actionTypes.START_LOADING});

        try {

            const userId = await register(password, reminder, passphrase);
            dispatch({type: actionTypes.USER_REGISTERED_SUCCESSFULLY, userId});
            dispatch({type: actionTypes.SHOW_LOGIN_VIEW});
        }
        catch (error) {
            console.log(error.message);
            dispatch({type: actionTypes.ERROR_OCCURRED, error: {message: error.message}});
        }

        dispatch({type: actionTypes.STOP_LOADING});
    }
};

export const changeUserCredentials = (newPassword, newPassphrase, newReminder, cacheLocal) => {
    return async (dispatch, getState) => {
        dispatch({type: actionTypes.START_LOADING});

        try {
            await changeCredentials(newPassword, newPassphrase, newReminder, {cacheLocal});
            dispatch({type: actionTypes.CREDENTIALS_CHANGED_SUCCESSFULLY})
        }
        catch (error) {
            dispatch({type: actionTypes.ERROR_OCCURRED, error: {message: error.message}});
        }

        dispatch({type: actionTypes.STOP_LOADING});
    }
};

export const needToSyncUserAccount = (userId) => {
    return async (dispatch, getState) => {
        dispatch({type: actionTypes.START_LOADING});

        try {
            const needToSync = await needToSyncAccount(userId);
            dispatch({type: actionTypes.NEED_TO_SYNC_ACCOUNT, needToSync})
        }
        catch (error) {
            dispatch({type: actionTypes.ERROR_OCCURRED, error: {message: error.message}});
        }

        dispatch({type: actionTypes.STOP_LOADING});
    }
};

export const synchronizeUserAccount = (passphrase, password, cacheLocal) => {
    return async (dispatch, getState) => {
        dispatch({type: actionTypes.START_LOADING});

        try {
            await synchronizeAccount(passphrase, password, {cacheLocal});
            dispatch({type: actionTypes.SYNCHRONIZED_ACCOUNT_SUCCESSFULLY})
        }
        catch (error) {
            dispatch({type: actionTypes.ERROR_OCCURRED, error: {message: error.message}});
        }

        dispatch({type: actionTypes.STOP_LOADING});
    }
};

export const showLoginView = () => {
    return async (dispatch, getState) => {
        dispatch({type: actionTypes.SHOW_LOGIN_VIEW});
    }
};

export const deleteUserAccount = () => {
    return async (dispatch, getState) => {
        dispatch({type: actionTypes.START_LOADING});

        try {
            const state = getState();

            await deleteUser(state.user.userId);
            await logOut();

            dispatch({type: actionTypes.DELETE_USER_DATA});
        }
        catch (error) {
            console.log(error.message);
            dispatch({type: actionTypes.ERROR_OCCURRED, error: {message: error.message}});
        }

        dispatch({type: actionTypes.STOP_LOADING});
    };
};

export const logout = () => {
    return async (dispatch, getState) => {
        dispatch({type: actionTypes.START_LOADING});

        try {
            await logOut();
            dispatch({type: actionTypes.DELETE_USER_DATA});
        }
        catch (error) {
            console.log(error.message);
            dispatch({type: actionTypes.ERROR_OCCURRED, error: {message: error.message}});
        }
        
        dispatch({type: actionTypes.STOP_LOADING});
    }
};

export const tabChanged = (index, last) => {
    return async (dispatch, getState) => {
        dispatch({type: actionTypes.RESET_STATE_FOR_CREDENTIALS});
    }
};