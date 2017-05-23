import React from 'react';
import { Row, Col } from 'react-flexbox-grid';
import '../../css/form-custom-style.css';
import ErrorComponentView from './errorView';

import {
    Button,
    FormRow,
    FormInput,
    Form,
    FormIconField,
    FormNote,
    FormField,
    Alert } from 'elemental'

let passwordInput;
let passphraseInput;
let newReminderInput;
let newPassphraseInput;


class ChangeBackupCredentials  extends React.Component {

    constructor(){
        super();
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(e){
        this.props.changeCredentials(
            passwordInput.refs.input.value,
            passphraseInput.refs.input.value,
            newReminderInput.refs.input.value,
            newPassphraseInput.refs.input.value);
    }

    componentDidUpdate() {
        if(this.props.backupChanged){
            passwordInput.refs.input.value = '';
            passphraseInput.refs.input.value = '';
            newReminderInput.refs.input.value = '';
            newPassphraseInput.refs.input.value = '';
        }
    }

    render () {
        return (
            <Row>
                <Col xs={12}>
                    <Row center="xs">
                        <Form className = "small-form-style tab-form-style">

                            <FormIconField width="one-half" iconPosition="left" iconColor="default" iconKey="key">
                                <FormInput type="password" placeholder="Password" name="icon-alignment-left" ref={node => { passwordInput = node }} />
                            </FormIconField>

                            <FormNote>{this.props.reminderString}</FormNote>

                            <FormIconField width="one-half" iconPosition="left" iconColor="default" iconKey="key">
                                <FormInput type="password" placeholder="Passphrase" name="icon-alignment-left" ref={node => { passphraseInput = node }}/>
                            </FormIconField>

                            <FormIconField width="one-half" iconPosition="left" iconColor="default" iconKey="question">
                                <FormInput placeholder="New Reminder" name="icon-alignment-left" ref={node => { newReminderInput = node }} />
                            </FormIconField>

                            <FormIconField width="one-half" iconPosition="left" iconColor="default" iconKey="key">
                                <FormInput type="password" placeholder="New Passphrase" name="icon-alignment-left" ref={node => { newPassphraseInput = node }}/>
                            </FormIconField>

                            <FormRow>
                                <ErrorComponentView error = {this.props.error} />
                            </FormRow>

                            {this.props.backupChanged ?
                                <FormRow>
                                    <Alert type="info">Backup credentials changed successfully</Alert>
                                </FormRow>
                                : null
                            }

                            <FormField>
                                <Button block={true}
                                        size="sm"
                                        type="success"
                                        onClick={(e) => this.onSubmit(e)}>Change Backup Credentials</Button>
                            </FormField>
                        </Form>
                    </Row>
                </Col>
            </Row>
        )}
}


ChangeBackupCredentials.PropTypes = {
    reminderString: React.PropTypes.string.isRequired
};

export default ChangeBackupCredentials;