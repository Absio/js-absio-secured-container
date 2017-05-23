import { connect } from 'react-redux';
import { containerActions, clearModalState,deleteExistingContainer } from '../../actions/containerActions'


import DeleteContainerModalView from '../../components/modals/deleteContainerModalView';

const mapStateToProps = (state) => {
    return {
        showModal: ( state.container.modal.show && state.container.modal.modalType === containerActions.SHOW_DELETE_MODAL ),
        containerId: state.container.modal.containerId
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        closeModal:() => dispatch(clearModalState()),
        deleteExistingContainer: (containerId) => dispatch(deleteExistingContainer(containerId))
    }
};

const DeleteContainerModalContainer = connect(mapStateToProps, mapDispatchToProps)(DeleteContainerModalView);

export default DeleteContainerModalContainer;