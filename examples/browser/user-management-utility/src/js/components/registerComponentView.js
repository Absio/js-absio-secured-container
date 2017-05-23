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
    FormField } from 'elemental'

let reminderInput;
let passwordInput;
let passphraseInput;

class RegisterComponentView  extends React.Component {

    constructor(){
        super();
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(e){
        this.props.register(
            passwordInput.refs.input.value,
            reminderInput.refs.input.value,
            passphraseInput.refs.input.value );
    }

    render () {
        return (
                <Row>
                    <Col xs={12}>
                        <Row center="xs">
                            <Form className = "small-form-style">

                                <FormRow>
                                    <h4><b>Absio Secured Container</b></h4>
                                    <h4><b>Register New User</b></h4>
                                </FormRow>

                                <FormIconField width="one-half" iconPosition="left" iconColor="default" iconKey="lock">
                                    <FormInput type="password" placeholder="Password" name="icon-alignment-left" ref={ (node) => { passwordInput = node }}/>
                                </FormIconField>

                                <FormIconField width="one-half" iconPosition="left" iconColor="default" iconKey="question">
                                    <FormInput placeholder="Reminder" name="icon-alignment-left" ref= {node => { reminderInput = node }} />
                                </FormIconField>

                                <FormIconField width="one-half" iconPosition="left" iconColor="default" iconKey="lock">
                                    <FormInput type="password" placeholder="Passphrase" name="icon-alignment-left" ref={node => { passphraseInput = node }} />
                                </FormIconField>

                                <FormRow>
                                    <ErrorComponentView error = { this.props.error } />
                                </FormRow>

                                <FormField>
                                    <Button block={true}
                                            size="sm"
                                            type="success"
                                            onClick={ e => this.onSubmit(e) }>Register</Button>
                                </FormField>

                                <FormField>
                                    <Button block={true} size="sm" type="success" onClick={() => this.props.cancel()}>Cancel</Button>
                                </FormField>
                            </Form>
                        </Row>
                    </Col>
                </Row>
        )}
}

export default RegisterComponentView;