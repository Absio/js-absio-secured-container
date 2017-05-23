import { connect } from 'react-redux';
import { containerActions, clearModalState } from '../../actions/containerActions'
import * as _  from 'lodash';
import ContainerInfoModalView from '../../components/modals/containerInfoModalView';

const mapStateToProps = (state) => {
    return {
        showModal: (state.container.modal.show && state.container.modal.modalType === containerActions.SHOW_CONTAINER_INFO_MODAL ),
        access: _.isEmpty(state.container.container) ? { } : state.container.container.access,
        header:_.isEmpty(state.container.container) ? { } : state.container.container.header,
        containerType: _.isEmpty(state.container.container) ? '' : state.container.container.type,
        containerId: state.container.modal.containerId
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        closeModal:() => dispatch(clearModalState())
    }
};

const ContainerInfoModalContainer = connect(mapStateToProps, mapDispatchToProps)(ContainerInfoModalView);

export default ContainerInfoModalContainer;