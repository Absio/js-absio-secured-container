import { connect } from "react-redux";
import SynchronizeAccount from "../components/synchronizeAccountComponentView";
import {
  needToSyncUserAccount,
  synchronizeUserAccount,
} from "../redux/actions";

const mapStateToProps = (state: any) => {
  return {
    needToSync: state.user.needToSync,
    synced: state.user.synced,
    loading: state.user.loading,
    error: state.user.error,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    needToSyncAccount: () => dispatch(needToSyncUserAccount()),
    synchronizeAccount: (passphrase: any, password: any, cacheLocal: any) =>
      dispatch(synchronizeUserAccount(passphrase, password, cacheLocal)),
  };
};

const SynchronizeAccountContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(SynchronizeAccount);

export default SynchronizeAccountContainer;
