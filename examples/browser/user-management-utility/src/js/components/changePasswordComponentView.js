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

let oldPasswordInput;
let newPasswordInput;
let passphraseInput;

class ChangePasswordComponentView extends React.Component {

    constructor(){
        super();
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(e){
        this.props.changePassword(
            oldPasswordInput.refs.input.value,
            passphraseInput.refs.input.value,
            newPasswordInput.refs.input.value );
    }

    componentDidUpdate() {
        if(this.props.passwordChanged){
            oldPasswordInput.refs.input.value = '';
            passphraseInput.refs.input.value = '';
            newPasswordInput.refs.input.value = '';
        }
    }

    render () {
        return (
                <Row>
                    <Col xs={12}>
                        <Row center="xs">
                            <Form className = "small-form-style tab-form-style">

                                <FormIconField width="one-half" iconPosition="left" iconColor="default" iconKey="key">
                                    <FormInput type="password" placeholder="Old Password" name="icon-alignment-left" ref={node => { oldPasswordInput = node }} />
                                </FormIconField>

                                <FormNote>{this.props.reminderString}</FormNote>

                                <FormIconField width="one-half" iconPosition="left" iconColor="default" iconKey="key">
                                    <FormInput type="password" placeholder="Passphrase" name="icon-alignment-left" ref={node => { passphraseInput = node }}/>
                                </FormIconField>

                                <FormIconField width="one-half" iconPosition="left" iconColor="default" iconKey="key">
                                    <FormInput type="password" placeholder="New Password" name="icon-alignment-left" ref={node => { newPasswordInput = node }} />
                                </FormIconField>

                                <FormRow>
                                    <ErrorComponentView error = {this.props.error} />
                                </FormRow>

                                {this.props.passwordChanged ?
                                    <FormRow>
                                        <Alert type="info">Password changed successfully</Alert>
                                    </FormRow>
                                    : null
                                }
                                <FormField>
                                    <Button block={true}
                                            size="sm"
                                            type="success"
                                            onClick={(e) => this.onSubmit(e)}>Change Password</Button>
                                </FormField>
                            </Form>
                        </Row>
                    </Col>
                </Row>
        )}
}


ChangePasswordComponentView.PropTypes = {
    reminderString: React.PropTypes.string.isRequired
};

export default ChangePasswordComponentView;