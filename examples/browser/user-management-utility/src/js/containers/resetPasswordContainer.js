import { connect } from 'react-redux';

import ResetPasswordComponentView from './../components/resetPasswordComponentView';
import { resetUserPassword, showLoginView } from './../actions';

const mapStateToProps = (state) => {
    return {
        loading: state.user.loading,
        error: state.user.error
    }
};

const mapDispatchToProps = (dispatch) => {

    return {
        resetPassword:(userId, passphrase, newPassword) =>  dispatch(resetUserPassword(userId, passphrase, newPassword)),
        cancel: () => dispatch(showLoginView())
    }
};


const ResetPasswordContainer = connect(mapStateToProps, mapDispatchToProps)(ResetPasswordComponentView);

export default ResetPasswordContainer;