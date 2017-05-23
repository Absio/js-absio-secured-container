import { actionTypes } from './constants';
import {
    register,
    logIn,
    resetPassword,
    getBackupReminder,
    changePassword,
    changeBackupCredentials,
    deleteUser,
    logOut } from 'absio-secured-container';


export const login = (id, password, passphrase)=>{
    return async (dispatch, getState) => {

        dispatch({type:actionTypes.START_LOADING});
        try{
            const reminder = await getBackupReminder(id);
            await logIn(id.trim(), password, passphrase, { cacheLocal : false });

            dispatch({ type:actionTypes.LOGIN_COMPLETED, reminder, id})
        }
        catch(error) {
                console.log(error.message);
                dispatch({type: actionTypes.ERROR_OCCURRED, error:{ message: error.message}});
        }
        dispatch({type:actionTypes.STOP_LOADING});
    };
};

export const showResetPassword = () => {
    return async (dispatch, getState) => {
        dispatch({ type:actionTypes.SHOW_RESET_PASSWORD_VIEW })
    };
};

export const showRegisterView = ()=>{
    return async (dispatch, getState) => {
        dispatch({ type:actionTypes.SHOW_REGISTER_VIEW })
    };
};

export const registerNewUser = (password, reminder, passphrase) => {
    return async (dispatch, getState) => {

        dispatch({type:actionTypes.START_LOADING});
        try {

            const userId = await register(password, reminder, passphrase);
            dispatch({type:actionTypes.USER_REGISTERED_SUCCESSFULLY, userId});
            dispatch({type:actionTypes.SHOW_LOGIN_VIEW});
        }
        catch(error) {
            console.log(error.message);
            dispatch({type: actionTypes.ERROR_OCCURRED, error:{ message: error.message}});
        }

        dispatch({type:actionTypes.STOP_LOADING});
    }
};

export const changeUserPassword = (oldPassword, passphrase, newPassword)=>{
    return async (dispatch, getState) => {
        dispatch({type:actionTypes.START_LOADING});
        try{
            await changePassword(passphrase, oldPassword, newPassword);
            dispatch({ type:actionTypes.PASSWORD_CHANGED_SUCCESSFULLY})
        }
        catch(error) {
            dispatch({type: actionTypes.ERROR_OCCURRED, error:{ message: error.message }});
        }
        dispatch({ type : actionTypes.STOP_LOADING});
    }
};

export const changeUserBackupCredentials = (password, passphrase, newReminder ,newpassphrase)=> {
    return async (dispatch, getState) => {
        dispatch({type:actionTypes.START_LOADING});
        try{
            await changeBackupCredentials(passphrase, password, newReminder, newpassphrase);
            dispatch({ type:actionTypes.BACKUP_CREDENTIALS_CHANGED_SUCCESSFULLY})
        }
        catch(error) {
            dispatch({type: actionTypes.ERROR_OCCURRED, error:{ message: error.message }});
        }
        dispatch({ type : actionTypes.STOP_LOADING});
    }
};

export const showLoginView = ()=> {
    return async (dispatch, getState) => {
        dispatch({ type: actionTypes.SHOW_LOGIN_VIEW });
    }
};

export const resetUserPassword = (userId, passphrase, newPassword)=>{
    return async (dispatch, getState) => {
        dispatch({type:actionTypes.START_LOADING});
        try{
            await resetPassword(userId, passphrase, newPassword);
            dispatch({type: actionTypes.PASSWORD_RESTORED_SUCCESSFULLY, userId});
            dispatch({type: actionTypes.SHOW_LOGIN_VIEW});
        }
        catch(error) {
            console.log(error.message);
            dispatch({type: actionTypes.ERROR_OCCURRED, error:{ message: error.message}});
        }

        dispatch({type:actionTypes.STOP_LOADING});
    }
};

export const deleteUserAccount = () => {
    return async (dispatch, getState) => {
        dispatch({type:actionTypes.START_LOADING});
        try{
            const state = getState();

            await deleteUser(state.user.userId);
            await logOut();

            dispatch({type:actionTypes.DELETE_USER_DATA});
        }
        catch(error) {
            console.log(error.message);
            dispatch({type: actionTypes.ERROR_OCCURRED, error:{ message: error.message}});
        }

        dispatch({type:actionTypes.STOP_LOADING});
    };
};

export const logout = () => {
    return async (dispatch, getState) => {
        dispatch({ type: actionTypes.START_LOADING });
        try {
            await logOut();
            dispatch({type:actionTypes.DELETE_USER_DATA});
        }
        catch(error){
            console.log(error.message);
            dispatch({type: actionTypes.ERROR_OCCURRED, error:{ message: error.message}});
        }
        dispatch({ type: actionTypes.STOP_LOADING });
    }
};

export const tabChanged = (index, last) =>{
    return async (dispatch, getState) => {
        dispatch({type: actionTypes.RESET_STATE_FOR_CREDENTIALS});
    }
};