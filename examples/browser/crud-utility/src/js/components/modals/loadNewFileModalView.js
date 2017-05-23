import React from 'react';
import Calendar from 'rc-calendar';
import 'rc-calendar/assets/index.css';
import moment from 'moment'
import ErrorComponentView from '../errorView';

import {
    Modal,
    ModalFooter,
    ModalHeader,
    ModalBody,
    Button,
    FormField,
    FormInput,
    FormRow,
    Checkbox,
    FileUpload,
    Row,
    Col } from  'elemental';


class LoadNewFileModal extends React.Component {

    constructor(){
        super();
        this.state = {
            modalIsOpen: false,
            permissionObj : {
                access:{
                    view: true,
                    modify: true,
                },
                container:{
                    decrypt: true,
                    download: true,
                    modifyType: true,
                    upload: true
                }
            },
            error:null,
            userID:'',
            headerContent:'',
            containerType:'',
            setExpirationTime: false,
            expirationDate: null,
            fileData: null,
            setNewUserPermissions: false
        };

        this.toggleModal = this.toggleModal.bind(this);
        this.handleUserIdOnBlur = this.handleUserIdOnBlur.bind(this);
        this.handleHeaderContentOnBlur = this.handleHeaderContentOnBlur.bind(this);
        this.handleContainerTypeOnBlur = this.handleContainerTypeOnBlur.bind(this);
        this.handlePermissionCheckBoxChange = this.handlePermissionCheckBoxChange.bind(this);
        this.expirationTimeChanged = this.expirationTimeChanged.bind(this);
        this.disabledDate = this.disabledDate.bind(this);
        this.handleDateSelect = this.handleDateSelect.bind(this);
        this.createButtonClicked = this.createButtonClicked.bind(this);
        this.handleFileSelect = this.handleFileSelect.bind(this);
        this.handleNewUserPermissionOnChange = this.handleNewUserPermissionOnChange.bind(this);
    }

    componentWillUpdate(nextProps, nextState){
        if(nextProps.showModal !== this.state.modalIsOpen){
            this.setState({ modalIsOpen: nextProps.showModal });
        }
    }

    createButtonClicked(){
        if( !this.state.headerContent.length ||
            !this.state.containerType.length ||
            (!this.state.userID.length && this.state.setNewUserPermissions) ||
            !this.state.fileData ){

            this.setState({error:{message: 'Please fill all fields and select a file'}});

            return;
        }

        let userIdToSetPermissionsFor = this.state.userID;

        if(!this.state.setNewUserPermissions){
            userIdToSetPermissionsFor = this.props.containerOwnerId;
        }

        this.toggleModal(false);
        this.props.createNewContainer(userIdToSetPermissionsFor, this.state.headerContent, this.state.containerType, this.state.permissionObj, this.state.expirationDate,this.state.fileData)
    }

    handlePermissionCheckBoxChange(e, propName){
        let newPermission = this.state.permissionObj;

        if(newPermission.access.hasOwnProperty(propName)) {
            newPermission.access[propName] = e.target.checked;
        }
        else {
            newPermission.container[propName] = e.target.checked;
        }

        this.setState({permissionObj: newPermission});
    }

    toggleModal(visible){
        this.setState({ modalIsOpen: visible });
        this.props.closeModal();
    }

    disabledDate(current) {

        if (!current || !this.state.setExpirationTime) {
            return true;
        }
        return moment().isAfter(current);
    }

    expirationTimeChanged(e){
        this.setState({ setExpirationTime: e.target.checked });
    }

    handleDateSelect(value){
        this.setState({ expirationDate: value });
    }

    handleHeaderContentOnBlur(e){
        this.setState({ headerContent: e.target.value});
    }

    handleContainerTypeOnBlur(e){
        this.setState({ containerType: e.target.value});
    }

    handleUserIdOnBlur(e){
        this.setState({ userID: e.target.value});
    }

    handleFileSelect(e, data){
        this.setState({ fileData: data});
    }

    handleNewUserPermissionOnChange(e){
        this.setState({setNewUserPermissions: e.target.checked});
    };

    render() {
        return (
            <Modal isOpen={this.state.modalIsOpen} onCancel={e => this.toggleModal(false)} backdropClosesModal>
                <ModalHeader text="Load New File" showCloseButton onClose={ e =>  this.toggleModal(false) }>
                </ModalHeader>
                <ModalBody>

                    <FormField label="Header content">
                        <FormInput type="text" placeholder="Enter header content"  onBlur={this.handleHeaderContentOnBlur}/>
                    </FormField>
                    <FormField label="Container Type">
                        <FormInput type="text" placeholder="Enter custom container type" onBlur={this.handleContainerTypeOnBlur}/>
                    </FormField>



                    <FormField>
                        <Checkbox label="Grant Access For New User" checked={this.state.setNewUserPermissions} onChange = {e => this.handleNewUserPermissionOnChange(e)} />
                        {   this.state.setNewUserPermissions
                            ? <FormInput type="text" placeholder="Enter user id" name="basic-form-input-email" onBlur={ this.handleUserIdOnBlur }/>
                            : null
                        }
                    </FormField>

                    <Row>
                        <Col xs="50%">
                            <FormRow> Container Permissions: </FormRow>
                            <FormField label="Access:">
                                <div className="inline-controls">
                                    <Checkbox label="view" checked={this.state.permissionObj.access.view} onChange = {e => this.handlePermissionCheckBoxChange(e,'view')} />
                                    <Checkbox label="modify" checked={this.state.permissionObj.access.modify} onChange = {e => this.handlePermissionCheckBoxChange(e, 'modify')} />
                                </div>
                            </FormField>

                            <FormField label="Container:">
                                <div className="inline-controls">
                                    <Checkbox label="decrypt" checked={this.state.permissionObj.container.decrypt} onChange = {e => this.handlePermissionCheckBoxChange(e,'decrypt')} />
                                    <Checkbox label="download" checked={this.state.permissionObj.container.download} onChange = {e => this.handlePermissionCheckBoxChange(e,'download')} />
                                </div>
                                <div className="inline-controls">
                                    <Checkbox label="modify type" checked={this.state.permissionObj.container.modifyType} onChange = {e => this.handlePermissionCheckBoxChange(e,'modifyType')} />
                                    <Checkbox label="upload" checked={this.state.permissionObj.container.upload} onChange = {e => this.handlePermissionCheckBoxChange(e,'upload')} />
                                </div>
                            </FormField>
                        </Col>
                        <Col xs="50%">
                            <Checkbox onChange={this.expirationTimeChanged}  label="Expiration date" />
                            <Calendar
                                showToday={false}
                                showOk={false}
                                disabledDate={this.disabledDate }
                                onSelect={this.handleDateSelect}
                            />
                        </Col>
                    </Row>
                </ModalBody>
                <ModalFooter>
                    <FormRow>
                        <ErrorComponentView error = {this.state.error} />
                    </FormRow>
                    <FileUpload accept="*" buttonLabelInitial="Upload File" buttonLabelChange="Change File" onChange={this.handleFileSelect} />
                    <br/>
                    <Button type="hollow-success" onClick={this.createButtonClicked} >Create Container</Button>
                    <Button type="link-cancel" onClick={e => this.toggleModal(false)}>Cancel</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

LoadNewFileModal.PropTypes = {
    showModal: React.PropTypes.bool.isRequired,
    containerOwnerId: React.PropTypes.string.isRequired,
};

export default LoadNewFileModal;