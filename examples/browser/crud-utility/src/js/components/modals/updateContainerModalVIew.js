import React from 'react';
import ErrorComponentView from '../errorView';

import {
    Modal,
    ModalFooter,
    ModalHeader,
    ModalBody,
    Button,
    FormField,
    FormInput,
    FileUpload,
    FormRow } from  'elemental';

class UpdateContainerModalView extends React.Component {

    constructor(){
        super();
        this.state = {
            modalIsOpen: false,
            fileData: null,
            headerContent:'',
            containerType:'',
            error:null
        };

        this.toggleModal = this.toggleModal.bind(this);
        this.handleUpdateButton = this.handleUpdateButton.bind(this);
        this.handleFileSelect = this.handleFileSelect.bind(this);
        this.handleHeaderContentOnBlur = this.handleHeaderContentOnBlur.bind(this);
        this.handleContainerTypeOnBlur = this.handleContainerTypeOnBlur.bind(this);

    }

    componentWillUpdate(nextProps, nextState){
        if(nextProps.showModal !== this.state.modalIsOpen){
            this.setState({ modalIsOpen: nextProps.showModal });
        }
    }

    handleFileSelect(e, data){
        this.setState({ fileData: data});
    }

    handleHeaderContentOnBlur(e){
        this.setState({ headerContent: e.target.value});
    }

    handleContainerTypeOnBlur(e){
        this.setState({ containerType: e.target.value});
    }

    toggleModal(visible){
        this.setState({ modalIsOpen: visible });
        this.props.closeModal();
    }

    handleUpdateButton(){

        if( !this.state.headerContent.length ||
            !this.state.containerType.length ||
            !this.state.fileData ){

            this.setState({error:{message: 'Please fill all fields and select a file'}});

            return;
        }

        this.toggleModal(false);
        this.props.update(this.props.containerId, this.state.headerContent, this.state.containerType, this.state.fileData);
    }

    render() {
        return (
            <Modal isOpen={this.state.modalIsOpen} onCancel={this.toggleModal} backdropClosesModal>
                <ModalHeader text="Update Container Content" showCloseButton onClose={ this.toggleModal }>
                </ModalHeader>
                <ModalBody>
                    <FormField label="Header content">
                        <FormInput autoFocus type="text" placeholder="Enter header content" onBlur={this.handleHeaderContentOnBlur}/>
                    </FormField>
                    <FormField label="Container Type">
                        <FormInput type="text" placeholder="Enter custom container type" onBlur={this.handleContainerTypeOnBlur}/>
                    </FormField>
                </ModalBody>
                <ModalFooter>
                    <FormRow>
                        <ErrorComponentView error = {this.state.error} />
                    </FormRow>
                    <FormField>
                        <FileUpload accept="*" buttonLabelInitial="Upload File" buttonLabelChange="Change File" onChange={this.handleFileSelect} />
                    </FormField>
                    <FormField>
                        <Button type="hollow-success" onClick={this.handleUpdateButton}>Update Container</Button>
                        <Button type="link-cancel" onClick={e => this.toggleModal(false)}>Cancel</Button>
                    </FormField>
                </ModalFooter>
            </Modal>
        );
    }
}

UpdateContainerModalView.PropTypes = {
    containerId: React.PropTypes.string.isRequired,
    showModal: React.PropTypes.bool.isRequired,
};

export default UpdateContainerModalView;