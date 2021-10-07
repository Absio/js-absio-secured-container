import { routerReducer, RouterState } from "react-router-redux";
import { combineReducers } from "redux";
import user, { UserState } from "./user";

export interface ViewerState {
  user: UserState;
  routing: RouterState;
}

const ViewerReducer = combineReducers({
  user: user,
  routing: routerReducer,
});

export default ViewerReducer;
