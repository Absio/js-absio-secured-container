import { connect } from 'react-redux';

import DataTableView from '../../components/dataTable/dataTableComponentView';
import { updateDataAndCallModalIfNeeded } from '../../actions/containerActions';
const mapStateToProps = (state) => {
    return {
        loading: state.user.loading,
        containerArray: state.user.containers,
        error: state.user.error
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        showModal: (type, containerId) => dispatch(updateDataAndCallModalIfNeeded(type, containerId))
    }
};

const DataTableContainer = connect(mapStateToProps, mapDispatchToProps)(DataTableView);

export default DataTableContainer;