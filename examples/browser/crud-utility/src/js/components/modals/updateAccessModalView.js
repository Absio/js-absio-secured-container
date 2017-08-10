import React from 'react';
import Calendar from 'rc-calendar';
import 'rc-calendar/assets/index.css';
import moment from 'moment'
import * as _  from 'lodash';
import ErrorComponentView from '../errorView';
import {
    Modal,
    ModalFooter,
    ModalHeader,
    ModalBody,
    Button,
    Checkbox,
    FormField,
    FormSelect,
    FormInput,
    Row,
    Col,
    FormRow } from  'elemental';

const defaultPermissions = {
    access:{
        view: false,
        modify: false,
    },
    container:{
        decrypt: false,
        download: false,
        viewType: false,
        modifyType: false,
        upload: false
    }
};

const initialState = {
    modalIsOpen: false,
    useExistingUser: false,
    setExpirationTime: false,
    userID:'',
    containerAccess:{},
    permissionObj : defaultPermissions,
    expirationDate: null,
    error:null
}

class UpdateAccessModal extends React.Component {

    constructor(){
        super();
        this.toggleModal = this.toggleModal.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
        this.handleButtonClick = this.handleButtonClick.bind(this);
        this.existingUserSelected = this.existingUserSelected.bind(this);
        this.expirationTimeChanged = this.expirationTimeChanged.bind(this);
        this.disabledDate = this.disabledDate.bind(this);
        this.handlePermissionCheckBoxChange = this.handlePermissionCheckBoxChange.bind(this);
        this.getPermissionsView = this.getPermissionsView.bind(this);
        this.handleUserIdOnBlur = this.handleUserIdOnBlur.bind(this);
        this.getExistingUserIds = this.getExistingUserIds.bind(this);
        this.updatePermissionsForSelectedUser = this.updatePermissionsForSelectedUser.bind(this);
        this.handleDateSelect = this.handleDateSelect.bind(this);
        this.state = initialState;
    }

    componentWillReceiveProps(nextProps){
        this.setState({ containerAccess: nextProps.access });
    }

    componentWillUpdate(nextProps, nextState){
        if(nextProps.showModal !== this.state.modalIsOpen){
            this.setState({ modalIsOpen: nextProps.showModal });
        }
    }

    handleButtonClick(){

        if(!this.state.userID.length) {
            if(this.state.useExistingUser){
                this.setState({error:{message: 'Please select the user'}});
            }
            else {
                this.setState({error:{message: 'Please enter user id'}});
            }
            return;
        }
        this.props.update(this.props.containerId, this.state.userID ,this.state.permissionObj, this.state.expirationDate);
        this.toggleModal(false);
    }

    disabledDate(current) {

        if (!current || !this.state.setExpirationTime) {
            return true;
        }

        return moment().isAfter(current);
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

    handleDateSelect(value){
        this.setState({ expirationDate: value });
    }

    updatePermissionsForSelectedUser(userId) {
        if(userId){
            if(this.state.containerAccess.hasOwnProperty(userId)) {
                this.setState({
                    permissionObj: this.state.containerAccess[userId].permissions});
            }
        }
        else {
            this.setState({ permissionObj: defaultPermissions, expirationDate: null });
        }
    }

    handleSelect(value){
        if(this.state.useExistingUser){
            this.setState({ userID: value});
            this.updatePermissionsForSelectedUser(value);
        }
    }

    expirationTimeChanged(e){
        this.setState({
            setExpirationTime: e.target.checked,
            expirationDate: null
        });
    }

    existingUserSelected(e){
        this.setState({ useExistingUser: e.target.checked, userID:''});
    }

    toggleModal(visible){
        this.setState(initialState);
        this.props.closeModal();
    }

    getPermissionsView(){

        return <Row>
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
                        <Checkbox label="view type" checked={this.state.permissionObj.container.viewType} onChange = {e => this.handlePermissionCheckBoxChange(e,'viewType')} />
                        <Checkbox label="upload" checked={this.state.permissionObj.container.upload} onChange = {e => this.handlePermissionCheckBoxChange(e,'upload')} />
                    </div>
                </FormField>
            </Col>
            <Col xs="50%">
                <Checkbox onChange={this.expirationTimeChanged}  label="Expiration date" />
                <Calendar
                    defaultValue={ moment() }
                    showToday={false}
                    showOk={false}
                    disabledDate={this.disabledDate }
                    onSelect={this.handleDateSelect}
                />
            </Col>
        </Row>
    }

    handleUserIdOnBlur(e){
        if(!this.state.useExistingUser) {
            this.setState({ userID: e.target.value});
            this.updatePermissionsForSelectedUser(e.target.value);
        }
    }

    getExistingUserIds(){

        if(this.state.useExistingUser && !_.isEmpty(this.state.containerAccess)){
            const userIds = _.keys(this.state.containerAccess);

            return userIds.map(function (userId) {
                return  { label: userId, value: userId };
            });
        }

        return [];
    }

    render() {
        return (
            <Modal isOpen={this.state.modalIsOpen} onCancel={this.toggleModal} backdropClosesModal>
                <ModalHeader text="Update Container Access" showCloseButton onClose={ this.toggleModal }>
                    <br/><h3>{this.props.containerId}</h3>
                </ModalHeader>
                <ModalBody>
                    <FormField>
                        <Checkbox onChange={this.existingUserSelected} label="Choose existing user" />
                    </FormField>
                    <Row>
                        <Col xs="50%">
                            <FormField label="Update Access For Existing User">
                                <FormSelect disabled = { !this.state.useExistingUser }
                                            options={this.getExistingUserIds()}
                                            firstOption="Select"
                                            onChange={this.handleSelect} />
                            </FormField>
                        </Col>
                        <Col xs="50%">
                            <FormField label="Grant Access For New User">
                                <FormInput disabled = { this.state.useExistingUser }
                                    autoFocus type="text" placeholder="Enter user id" name="basic-form-input-email"
                                    onBlur={ this.handleUserIdOnBlur } />
                            </FormField>
                        </Col>
                    </Row>
                    {this.state.userID.length > 0 ? this.getPermissionsView(): null }
                </ModalBody>
                <ModalFooter>
                    <FormRow>
                        <ErrorComponentView error = {this.state.error} />
                    </FormRow>
                    <Button type="primary" onClick={this.handleButtonClick}>Update</Button>
                    <Button type="link-cancel" onClick={e => this.toggleModal(false)}>Close</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

UpdateAccessModal.PropTypes = {
    access: React.PropTypes.object.isRequired,
    containerId: React.PropTypes.string.isRequired,
    showModal: React.PropTypes.bool.isRequired
};

export default UpdateAccessModal;