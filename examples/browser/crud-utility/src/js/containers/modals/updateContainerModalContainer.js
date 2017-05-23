import { connect } from 'react-redux';
import { containerActions, updateExistingContainer, clearModalState } from '../../actions/containerActions'


import UpdateContainerModalView from '../../components/modals/updateContainerModalVIew';

const mapStateToProps = (state) => {
    return {
        showModal: ( state.container.modal.show && state.container.modal.modalType === containerActions.SHOW_UPDATE_CONTAINER_MODAL ),
        containerId: state.container.modal.containerId
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        closeModal:() => dispatch(clearModalState()),
        update: (containerId, headerContent, containerType, fileBlob) => dispatch(updateExistingContainer(containerId, headerContent, containerType, fileBlob))
    }
};

const UpdateContainerModalContainer = connect(mapStateToProps, mapDispatchToProps)(UpdateContainerModalView);

export default UpdateContainerModalContainer;