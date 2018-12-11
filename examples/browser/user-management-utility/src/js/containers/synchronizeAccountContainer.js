import {connect} from 'react-redux';
import SynchronizeAccount from './../components/synchronizeAccountComponentView';
import {needToSyncUserAccount, synchronizeUserAccount} from './../actions';

const mapStateToProps = (state) => {
    return {
        needToSync: state.user.needToSync,
        synced: state.user.synced,
        loading: state.user.loading,
        error: state.user.error
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        needToSyncAccount: () => dispatch(needToSyncUserAccount()),
        synchronizeAccount: (passphrase, password, cacheLocal) => dispatch(synchronizeUserAccount(passphrase, password, cacheLocal))
    }
};

const SynchronizeAccountContainer = connect(mapStateToProps, mapDispatchToProps)(SynchronizeAccount);

export default SynchronizeAccountContainer;