import { connect } from 'react-redux';

import LoginComponentView from './../components/loginComponentView';
import { login, showRegisterView, showResetPassword } from './../actions';

const mapStateToProps = (state) => {
    return {
        loading: state.user.loading,
        error: state.user.error,
        userId: state.user.userId
    }
};

const mapDispatchToProps = (dispatch) => {

    return {
        login: (id, password, passphrase) => dispatch(login(id,password,passphrase)),
        register:() =>  dispatch(showRegisterView()),
        resetPassword: () => dispatch(showResetPassword())
    }
};


const LoginContainer = connect(mapStateToProps, mapDispatchToProps)(LoginComponentView);

export default LoginContainer;