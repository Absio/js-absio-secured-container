import {
  changeCredentials,
  deleteUser,
  getBackupReminder,
  logIn,
  logOut,
  needToSyncAccount,
  register,
  synchronizeAccount,
} from "absio-secured-container";
import { actionTypes } from "../constants";

export const login = (
  id: string,
  password: string,
  passphrase: string,
  cacheLocal: any
) => {
  return async (dispatch: any, getState: any) => {
    dispatch({ type: actionTypes.START_LOADING });

    try {
      const reminder = await getBackupReminder(id);
      await logIn(id.trim(), password, passphrase, { cacheLocal });

      dispatch({ type: actionTypes.LOGIN_COMPLETED, reminder, id });
    } catch (error: any) {
      console.log(error.message);
      dispatch({
        type: actionTypes.ERROR_OCCURRED,
        error: { message: error.message },
      });
    }

    dispatch({ type: actionTypes.STOP_LOADING });
  };
};

export const showResetPassword = () => {
  return async (dispatch: any, getState: any) => {
    dispatch({ type: actionTypes.SHOW_RESET_PASSWORD_VIEW });
  };
};

export const showRegisterView = () => {
  return async (dispatch: any, getState: any) => {
    dispatch({ type: actionTypes.SHOW_REGISTER_VIEW });
  };
};

export const registerNewUser = (
  password: string,
  reminder: string,
  passphrase: string
) => {
  return async (dispatch: any, getState: any) => {
    dispatch({ type: actionTypes.START_LOADING });

    try {
      const userId = await register(password, reminder, passphrase);
      dispatch({ type: actionTypes.USER_REGISTERED_SUCCESSFULLY, userId });
      dispatch({ type: actionTypes.SHOW_LOGIN_VIEW });
    } catch (error: any) {
      console.log(error.message);
      dispatch({
        type: actionTypes.ERROR_OCCURRED,
        error: { message: error.message },
      });
    }

    dispatch({ type: actionTypes.STOP_LOADING });
  };
};

export const changeUserCredentials = (
  newPassword: string,
  newPassphrase: string,
  newReminder: string,
  cacheLocal: boolean
) => {
  return async (dispatch: any, getState: any) => {
    dispatch({ type: actionTypes.START_LOADING });

    try {
      await changeCredentials(newPassword, newPassphrase, newReminder, {
        cacheLocal,
      });
      dispatch({ type: actionTypes.CREDENTIALS_CHANGED_SUCCESSFULLY });
    } catch (error: any) {
      dispatch({
        type: actionTypes.ERROR_OCCURRED,
        error: { message: error.message },
      });
    }

    dispatch({ type: actionTypes.STOP_LOADING });
  };
};

export const needToSyncUserAccount = () => {
  return async (dispatch: any, getState: any) => {
    dispatch({ type: actionTypes.START_LOADING });

    try {
      const state = getState();
      const needToSync = await needToSyncAccount(state.user.userId);
      dispatch({ type: actionTypes.NEED_TO_SYNC_ACCOUNT, needToSync });
    } catch (error: any) {
      dispatch({
        type: actionTypes.ERROR_OCCURRED,
        error: { message: error.message },
      });
    }

    dispatch({ type: actionTypes.STOP_LOADING });
  };
};

export const synchronizeUserAccount = (
  passphrase: string,
  password: string,
  cacheLocal: boolean
) => {
  return async (dispatch: any, getState: any) => {
    dispatch({ type: actionTypes.START_LOADING });

    try {
      await synchronizeAccount(passphrase, password, { cacheLocal });
      dispatch({ type: actionTypes.SYNCHRONIZED_ACCOUNT_SUCCESSFULLY });
    } catch (error: any) {
      dispatch({
        type: actionTypes.ERROR_OCCURRED,
        error: { message: error.message },
      });
    }

    dispatch({ type: actionTypes.STOP_LOADING });
  };
};

export const showLoginView = () => {
  return async (dispatch: any, getState: any) => {
    dispatch({ type: actionTypes.SHOW_LOGIN_VIEW });
  };
};

export const deleteUserAccount = () => {
  return async (dispatch: any, getState: any) => {
    dispatch({ type: actionTypes.START_LOADING });

    try {
      const state = getState();

      await deleteUser();
      await logOut();

      dispatch({ type: actionTypes.DELETE_USER_DATA });
    } catch (error: any) {
      console.log(error.message);
      dispatch({
        type: actionTypes.ERROR_OCCURRED,
        error: { message: error.message },
      });
    }

    dispatch({ type: actionTypes.STOP_LOADING });
  };
};

export const logout = () => {
  return async (dispatch: any, getState: any) => {
    dispatch({ type: actionTypes.START_LOADING });

    try {
      await logOut();
      dispatch({ type: actionTypes.DELETE_USER_DATA });
    } catch (error: any) {
      console.log(error.message);
      dispatch({
        type: actionTypes.ERROR_OCCURRED,
        error: { message: error.message },
      });
    }

    dispatch({ type: actionTypes.STOP_LOADING });
  };
};

export const tabChanged = () => {
  return async (dispatch: any, getState: any) => {
    dispatch({ type: actionTypes.RESET_STATE_FOR_CREDENTIALS });
  };
};
