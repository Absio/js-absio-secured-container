import React from "react";
import { connect } from "react-redux";
import MainView from "../components/mainView";
import { childViewNames } from "../constants";
import LoginContainer from "./loginContainer";
import RegisterContainer from "./registerContainer";
import TabViewContainer from "./tabViewContainer";

const childFromState = (state: any) => {
  let child = null;

  if (state && state.user && state.user.childName) {
    switch (state.user.childName) {
      case childViewNames.login:
        child = <LoginContainer />;
        break;
      case childViewNames.register:
        child = <RegisterContainer />;
        break;
      case childViewNames.tabView:
        child = <TabViewContainer />;
        break;
      default:
        child = <LoginContainer />;
        break;
    }
  }

  return child;
};

const mapStateToProps = (state: any, ownProps: any) => {
  let child;

  if (ownProps.children) {
    child = ownProps.children;
  } else {
    child = childFromState(state);
  }

  return {
    loading: state.user.loading,
    child: child,
  };
};

const MainContainer = connect(mapStateToProps)(MainView);

export default MainContainer;
