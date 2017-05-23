import { connect } from 'react-redux';
import ChangePasswordComponentView from './../components/changePasswordComponentView';
import { changeUserPassword } from './../actions';

const mapStateToProps = (state) => {
    return {
        reminderString: state.user.reminder,
        passwordChanged: state.user.passwordChanged,
        loading: state.user.loading,
        error: state.user.error
    }
};

const mapDispatchToProps = (dispatch) => {

    return {
        changePassword:(oldPassword, passphrase, newPassword) =>  dispatch(changeUserPassword (oldPassword, passphrase, newPassword)),
    }
};

const ChangePasswordContainer = connect(mapStateToProps, mapDispatchToProps)(ChangePasswordComponentView);

export default ChangePasswordContainer;