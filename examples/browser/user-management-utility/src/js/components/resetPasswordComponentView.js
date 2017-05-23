import React from 'react';
import { Row, Col } from 'react-flexbox-grid';
import '../../css/form-custom-style.css';
import ErrorComponentView from './errorView';

import {
    Button,
    FormRow,
    FormInput,
    Form,
    FormField,
    FormIconField } from 'elemental'

let idInput;
let passwordInput;
let passphraseInput;

class ResetPasswordComponentView  extends React.Component {

    constructor(){
        super();
        this.onSubmit = this.onSubmit.bind(this);
    }

    onSubmit(e){

        this.props.resetPassword(
            idInput.refs.input.value,
            passphraseInput.refs.input.value,
            passwordInput.refs.input.value)
    }

    render () {
        return (
                <Row>
                    <Col xs={12}>
                        <Row center="xs">
                            <Form className = "small-form-style">

                                <FormRow>
                                    <h4><b>Absio Secured Container</b></h4>
                                    <h4><b>Reset User Password</b></h4>
                                </FormRow>

                                <FormIconField width="one-half" iconPosition="left" iconColor="default" iconKey="key">
                                    <FormInput placeholder="ID" name="icon-alignment-left" ref={node => { idInput = node }} />
                                </FormIconField>

                                <FormIconField width="one-half" iconPosition="left" iconColor="default" iconKey="lock">
                                    <FormInput type="password" placeholder="New Password" name="icon-alignment-left" ref={node => { passwordInput = node }}/>
                                </FormIconField>

                                <FormIconField width="one-half" iconPosition="left" iconColor="default" iconKey="lock">
                                    <FormInput type="password" placeholder="Passphrase" name="icon-alignment-left" ref={node => { passphraseInput = node }} />
                                </FormIconField>

                                <FormRow>
                                    <ErrorComponentView error = {this.props.error} />
                                </FormRow>

                                <FormField>
                                    <Button block={true}
                                            size="sm"
                                            type="success"
                                            onClick={(e) => this.onSubmit(e)} >Reset Password</Button>
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

export default ResetPasswordComponentView;