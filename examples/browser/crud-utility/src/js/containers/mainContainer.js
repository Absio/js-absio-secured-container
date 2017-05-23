import React from 'react';
import { connect } from 'react-redux';
import MainView from '../components/mainView';
import LoginContainer from './loginContainer';
import MainGridContainer from './mainGridContainer';
import { childViewNames } from '../constants';

const childFromState = (state) => {
    let child = null;

    if (state && state.user && state.user.childName) {
        switch(state.user.childName) {
            case childViewNames.login:
                child = <LoginContainer/>;
            break;
            case childViewNames.mainGridView:
                child = <MainGridContainer/>;
            break;
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
