import { connect } from "react-redux";
import DeleteUserComponentView from "../components/deleteUserViewComponent";
import { deleteUserAccount } from "../redux/actions";

const mapStateToProps = (state: any) => {
  return {};
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    deleteUser: () => dispatch(deleteUserAccount()),
  };
};

const DeleteUserContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DeleteUserComponentView);

export default DeleteUserContainer;
