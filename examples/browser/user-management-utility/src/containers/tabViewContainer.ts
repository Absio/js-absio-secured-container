import { connect } from "react-redux";
import TabViewComponentView from "../components/tabViewComponent";
import { logout, tabChanged } from "../redux/actions";

const mapStateToProps = (state: any) => {
  return {
    userId: state.user.userId,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    tabChanged: () => dispatch(tabChanged()),
    logOut: () => dispatch(logout()),
  };
};

const TabViewContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(TabViewComponentView);

export default TabViewContainer;
