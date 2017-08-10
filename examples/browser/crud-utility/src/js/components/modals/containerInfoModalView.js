import React from 'react';

import moment from 'moment'
import * as _  from 'lodash';

import {
    Modal,
    ModalFooter,
    ModalHeader,
    ModalBody,
    Button,
    Row,
    Col,
    FormField,
    Card,
    Table } from  'elemental';

class ContainerModal extends React.Component {

    constructor(){
        super();
        this.state = {
            modalIsOpen: false,
            access:{}
        };

        this.getHeaderContent = this.getHeaderContent.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.createAccessTableRows = this.createAccessTableRows.bind(this);
    }

    componentWillReceiveProps(nextProps){
        this.setState({ access: nextProps.access });
    }

    componentWillUpdate(nextProps, nextState){
        if(nextProps.showModal !== this.state.modalIsOpen){
            this.setState({ modalIsOpen: nextProps.showModal });
        }
    }

    getHeaderContent(){

        let cardsArray = [];
        for(let prop in this.props.header) {
            cardsArray.push( <Card key={prop}>{ prop + ': ' + this.props.header[prop]}</Card> );
        }

        return cardsArray;
    }

    toggleModal(visible){
        this.setState({ modalIsOpen: visible });
        this.props.closeModal();
    }

    createAccessTableRows(){

        let rows = [];
        for(let containerId in this.state.access){

            const permissions = this.state.access[containerId].permissions;
            let dateToShow = this.state.access[containerId].expiration;

            if(dateToShow){
                dateToShow = new Date(dateToShow).toLocaleString();
            }

            rows.push(
                <tr key={containerId}>
                    <td>{containerId}</td>
                    <td>{permissions.access.view.toString() }</td>
                    <td>{permissions.access.modify.toString()}</td>
                    <td>{permissions.container.decrypt.toString()}</td>
                    <td>{permissions.container.download.toString()}</td>
                    <td>{permissions.container.modifyType.toString()}</td>
                    <td>{permissions.container.viewType.toString()}</td>
                    <td>{permissions.container.upload.toString()}</td>
                    <td>{dateToShow}</td>
                </tr>
            );
        }

        return rows;
    }

    render() {
        return (
            <Modal isOpen={this.state.modalIsOpen} onCancel={this.toggleModal} backdropClosesModal>
                <ModalHeader text={"Container: " + this.props.containerId} showCloseButton onClose={ this.toggleModal }>
                </ModalHeader>
                <ModalBody>
                    <Row>
                        <Col xs="50%">
                            <FormField label="Header:">
                                {this.getHeaderContent()}
                            </FormField>
                        </Col>
                        <Col xs="50%">
                            <FormField label="Type:">
                                <Card> {this.props.containerType} </Card>
                            </FormField>
                        </Col>
                    </Row>
                    <FormField label="Access List:">
                        <Table>
                            <colgroup>
                                <col width="" />
                                <col width="10%" />
                                <col width="10%" />
                                <col width="10%" />
                                <col width="10%" />
                                <col width="10%" />
                                <col width="10%" />
                                <col width="10%" />
                                <col width="10%" />
                            </colgroup>
                            <thead>
                            <tr>
                                <th>User ID</th>
                                <th>View Access</th>
                                <th>Modify Access</th>
                                <th>Decrypt</th>
                                <th>Download</th>
                                <th>Modify Type</th>
                                <th>View Type</th>
                                <th>Upload</th>
                                <th>Expires</th>
                            </tr>
                            </thead>
                            <tbody>
                            {this.createAccessTableRows()}
                            </tbody>
                        </Table>
                    </FormField>
                </ModalBody>
                <ModalFooter>
                    <Button type="hollow-primary" onClick={e => this.toggleModal(false)}>Close</Button>
                </ModalFooter>
            </Modal>
        );
    }
}

ContainerModal.PropTypes = {
    access: React.PropTypes.object.isRequired,
    containerId: React.PropTypes.string.isRequired,
    showModal: React.PropTypes.bool.isRequired,
    containerType: React.PropTypes.string.isRequired,
    header:React.PropTypes.object.isRequired,
    error: React.PropTypes.string
};

export default ContainerModal;
