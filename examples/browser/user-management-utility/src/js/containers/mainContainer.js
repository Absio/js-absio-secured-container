import React from 'react';
import { connect } from 'react-redux';
import MainView from '../components/mainView';
import LoginContainer from './loginContainer';
import RegisterContainer from './registerContainer';
import ResetPasswordContainer from './resetPasswordContainer';
import TabViewContainer from './tabViewContainer';
import { childViewNames } from '../constants';

const childFromState = (state) => {
    let child = null;

    if (state && state.user && state.user.childName) {
        switch(state.user.childName) {
            case childViewNames.login:
                child = <LoginContainer/>;
                break;
            case childViewNames.register:
                child = <RegisterContainer/>;
                break;
            case childViewNames.resetPassword:
                child = <ResetPasswordContainer/>;
                break;
            case childViewNames.tabView:
                child = <TabViewContainer/>;
        }
    }

    return child;
};

const mapStateToProps = (state, ownProps) => {
    let child;

    if (ownProps.children) {
        child = ownProps.children;
    }
    else {
        child = childFromState(state);
    }

    return {
        loading: state.user.loading,
        child: child
    };
};

const MainContainer = connect(mapStateToProps)(MainView);

export default MainContainer;
