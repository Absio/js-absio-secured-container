import { connect } from "react-redux";
import RegisterComponentView from "../components/registerComponentView";
import { registerNewUser, showLoginView } from "../redux/actions";

const mapStateToProps = (state: any) => {
  return {
    loading: state.user.loading,
    error: state.user.error,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    register: (password: any, reminder: any, passphrase: any) =>
      dispatch(registerNewUser(password, reminder, passphrase)),
    cancel: () => dispatch(showLoginView()),
  };
};

const RegisterContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(RegisterComponentView);

export default RegisterContainer;
