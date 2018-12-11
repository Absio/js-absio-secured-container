import {connect} from 'react-redux';
import ChangeCredentials from './../components/changeCredentialsComponentView';
import {changeUserCredentials} from './../actions';

const mapStateToProps = (state) => {
    return {
        reminderString: state.user.reminder,
        backupChanged: state.user.backupChanged,
        loading: state.user.loading,
        error: state.user.error
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        changeCredentials: (newPassword, newPassphrase, newReminder, cacheLocal) => {
            dispatch(changeUserCredentials(newPassword, newPassphrase, newReminder, cacheLocal));
        }
    }
};

const ChangeCredentialsContainer = connect(mapStateToProps, mapDispatchToProps)(ChangeCredentials);

export default ChangeCredentialsContainer;