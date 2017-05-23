import React from 'react';
import {
    Modal,
    ModalFooter,
    ModalHeader,
    ModalBody,
    Button} from  'elemental';

class DeleteContainerModal extends React.Component {

    constructor(){
        super();
        this.state = {
            modalIsOpen: false,
        };

        this.toggleModal = this.toggleModal.bind(this);
        this.handleDeleteButton = this.handleDeleteButton.bind(this);
    }

    componentWillUpdate(nextProps, nextState){
        if(nextProps.showModal !== this.state.modalIsOpen){
            this.setState({ modalIsOpen: nextProps.showModal });
        }
    }

    toggleModal(visible){
        this.setState({ modalIsOpen: visible });
        this.props.closeModal();
    }

    handleDeleteButton(){
        this.toggleModal(false);
        this.props.deleteExistingContainer(this.props.containerId)
    }

    render() {
        return (
            <Modal isOpen={this.state.modalIsOpen} onCancel={e => this.toggleModal(false)} backdropClosesModal>
                <ModalHeader text="Delete Container" showCloseButton onClose={ e => this.toggleModal(false) }>
                </ModalHeader>
                <ModalBody>
                    { 'Delete container with id: ' + this.props.containerId }
                </ModalBody>
                <ModalFooter>
                    <Button type="hollow-danger" onClick={this.handleDeleteButton}>Delete</Button>
                    <Button type="link-cancel" onClick={e => this.toggleModal(false)}>Cancel</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

DeleteContainerModal.PropTypes = {
    containerId: React.PropTypes.string.isRequired,
    showModal: React.PropTypes.bool.isRequired,
};

export default DeleteContainerModal;