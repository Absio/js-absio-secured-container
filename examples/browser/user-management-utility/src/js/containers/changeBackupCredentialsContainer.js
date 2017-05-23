import { connect } from 'react-redux';
import ChangeBackupCredentials from './../components/changeBackupCredentialsComponentView';
import { changeUserBackupCredentials } from './../actions';

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
        changeCredentials:(password, passphrase, newReminder ,newpassphrase) =>  dispatch(changeUserBackupCredentials (password, passphrase, newReminder ,newpassphrase)),
    }
};

const ChangeBackupCredentialsContainer = connect(mapStateToProps, mapDispatchToProps)(ChangeBackupCredentials);

export default ChangeBackupCredentialsContainer;