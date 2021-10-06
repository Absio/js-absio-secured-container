import { actionTypes, childViewNames } from "../../constants";

export interface UserState {
  userId: string | null,
  childName: string,
  error: string | null,
  loading: boolean,
  reminder: string,
  passwordChanged: boolean,
  backupChanged: boolean,
  needToSync: boolean | null,
  synced: boolean,
}

const initialState = {
  userId: null,
  childName: childViewNames.login,
  error: null,
  loading: false,
  reminder: "",
  passwordChanged: false,
  backupChanged: false,
  needToSync: null,
  synced: false,
};

const mainView = (state: UserState, action: any) => {
  if (typeof state === "undefined") {
    return initialState;
  }
  switch (action.type) {
    case actionTypes.START_LOADING:
      return Object.assign({}, state, { loading: true, error: null });
    case actionTypes.STOP_LOADING:
      return Object.assign({}, state, { loading: false });
    case actionTypes.ERROR_OCCURRED:
      return Object.assign({}, state, { error: action.error });
    case actionTypes.SHOW_REGISTER_VIEW:
      return Object.assign({}, state, {
        childName: childViewNames.register,
        error: null,
      });
    case actionTypes.USER_REGISTERED_SUCCESSFULLY:
      return Object.assign({}, state, { userId: action.userId });
    case actionTypes.SHOW_RESET_PASSWORD_VIEW:
      return Object.assign({}, state, {
        childName: childViewNames.resetPassword,
        error: null,
      });
    case actionTypes.LOGIN_COMPLETED:
      return Object.assign({}, state, {
        childName: childViewNames.tabView,
        reminder: action.reminder,
        userId: action.id,
      });
    case actionTypes.RESET_STATE_FOR_CREDENTIALS:
      return Object.assign({}, state, {
        passwordChanged: false,
        backupChanged: false,
        error: null,
        needToSync: null,
        synced: false,
      });
    case actionTypes.CREDENTIALS_CHANGED_SUCCESSFULLY:
      return Object.assign({}, state, { backupChanged: true });
    case actionTypes.SHOW_LOGIN_VIEW:
      return Object.assign({}, state, { childName: childViewNames.login });
    case actionTypes.DELETE_USER_DATA:
      return initialState;
    case actionTypes.NEED_TO_SYNC_ACCOUNT:
      return Object.assign({}, state, {
        needToSync: action.needToSync,
        synced: false,
      });
    case actionTypes.SYNCHRONIZED_ACCOUNT_SUCCESSFULLY:
      return Object.assign({}, state, { synced: true, needToSync: null });

    default:
      return state;
  }
};

export default mainView;
