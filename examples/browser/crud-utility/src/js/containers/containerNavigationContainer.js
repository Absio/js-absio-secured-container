import { connect } from 'react-redux';
import { containerActions} from '../actions/containerActions'
import { processEvents, searchById } from '../actions';

import ContainerNavigationView from '../components/containerNavigationView';

const mapStateToProps = (state) => {
    return {
        loading: state.user.loading,
        error: state.user.error
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        showLoadNewFileModal: () =>   dispatch({ type: containerActions.SHOW_LOAD_NEW_FILE_MODAL, showModal: true }),
        refreshContainers:() => dispatch(processEvents()),
        searchById:(value)=> dispatch(searchById(value))
    }
};

const ContainerNavigationContainer = connect(mapStateToProps, mapDispatchToProps)(ContainerNavigationView);

export default ContainerNavigationContainer;