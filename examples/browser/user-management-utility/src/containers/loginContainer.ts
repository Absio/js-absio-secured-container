import { connect } from "react-redux";
import LoginComponentView from "../components/loginComponentView";
import { login, showRegisterView } from "../redux/actions";
import { ViewerState } from "../redux/reducers";

const mapStateToProps = (state: ViewerState) => {
  return {
    error: state.user.error,
    userId: state.user.userId,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    login: (
      id: string,
      password: string,
      passphrase: string,
      cacheLocal: boolean
    ) => dispatch(login(id, password, passphrase, cacheLocal)),
    register: () => dispatch(showRegisterView()),
  };
};

const LoginContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginComponentView);

export default LoginContainer;
