import {connect} from 'react-redux';

import RegisterComponentView from './../components/registerComponentView';

import {showLoginView, registerNewUser} from './../actions';

const mapStateToProps = (state) => {
    return {
        loading: state.user.loading,
        error: state.user.error
    }
};

const mapDispatchToProps = (dispatch) => {

    return {
        register: (password, reminder, passphrase) => dispatch(registerNewUser(password, reminder, passphrase)),
        cancel: () => dispatch(showLoginView())
    }
};


const RegisterContainer = connect(mapStateToProps, mapDispatchToProps)(RegisterComponentView);

export default RegisterContainer;