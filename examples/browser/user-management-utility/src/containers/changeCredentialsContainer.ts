import { connect } from "react-redux";
import ChangeCredentials from "../components/changeCredentialsComponentView";
import { changeUserCredentials } from "../redux/actions";

const mapStateToProps = (state: any) => {
  return {
    reminderString: state.user.reminder,
    backupChanged: state.user.backupChanged,
    loading: state.user.loading,
    error: state.user.error,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    changeCredentials: (
      newPassword: any,
      newPassphrase: any,
      newReminder: any,
      cacheLocal: any
    ) => {
      dispatch(
        changeUserCredentials(
          newPassword,
          newPassphrase,
          newReminder,
          cacheLocal
        )
      );
    },
  };
};

const ChangeCredentialsContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ChangeCredentials);

export default ChangeCredentialsContainer;
