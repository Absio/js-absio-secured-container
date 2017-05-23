import { connect } from 'react-redux';
import { createNewContainer, clearModalState, containerActions} from '../../actions/containerActions';

import LoadNewFileModal from '../../components/modals/loadNewFileModalView';

const mapStateToProps = (state) => {
    return {
        showModal: ( state.container.modal.show && state.container.modal.modalType === containerActions.SHOW_LOAD_NEW_FILE_MODAL ),
        containerOwnerId: state.user.userId
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        closeModal:() => dispatch(clearModalState()),
        createNewContainer:(userId, headerContent, containerType, permissions, expirationDate, fileBlob) => dispatch(createNewContainer(userId, headerContent, containerType, permissions, expirationDate, fileBlob))
    }
};

const LoadNewFileModalContainer = connect(mapStateToProps, mapDispatchToProps)(LoadNewFileModal);

export default LoadNewFileModalContainer;