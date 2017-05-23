import { connect } from 'react-redux';
import { containerActions, clearModalState, updateContainerAccess } from '../../actions/containerActions'
import * as _  from 'lodash';
import UpdateAccessModalView from '../../components/modals/updateAccessModalView';

const mapStateToProps = (state) => {
    return {
        showModal: ( state.container.modal.show && state.container.modal.modalType === containerActions.SHOW_UPDATE_ACCESS_MODAL ),
        access: _.isEmpty(state.container.container) ? { } : state.container.container.access,
        containerId: state.container.modal.containerId
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        closeModal:() => dispatch(clearModalState()),
        update: (containerId, userId, permissions, expirationDate) => dispatch(updateContainerAccess(containerId, userId, permissions, expirationDate))
    }
};
const UpdateAccessModalContainer = connect(mapStateToProps, mapDispatchToProps)(UpdateAccessModalView);

export default UpdateAccessModalContainer;