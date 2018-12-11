import React from 'react';
import {Row, Col} from 'react-flexbox-grid';
import '../../css/form-custom-style.css';
import ErrorComponentView from './errorView';

import {
    Button,
    FormRow,
    FormInput,
    Form,
    FormIconField,
    FormField,
    Checkbox
} from 'elemental';

let idInput;
let passwordInput;
let passphraseInput;
let cacheLocal;


class LoginComponentView extends React.Component {

    componentDidMount() {
        if (this.props.userId) {
            idInput.refs.input.value = this.props.userId;
        }
    }

    login() {
        this.props.login(
            idInput.refs.input.value,
            passwordInput.refs.input.value,
            passphraseInput.refs.input.value,
            cacheLocal.refs.target.checked
        );
    }

    render() {
        return (
            <Row>
                <Col xs={12}>
                    <Row center="xs">
                        <Form className="small-form-style">

                            <FormRow>
                                <h4><b>Absio Secured Container</b></h4>
                                <h4><b>Control Panel</b></h4>
                            </FormRow>

                            <FormIconField width="one-half" iconPosition="left" iconColor="default" iconKey="key">
                                <FormInput placeholder="ID" name="icon-alignment-left" ref={node => {
                                    idInput = node
                                }}/>
                            </FormIconField>

                            <FormIconField width="one-half" iconPosition="left" iconColor="default" iconKey="lock">
                                <FormInput type="password" placeholder="Password" name="icon-alignment-left" ref={node => {
                                    passwordInput = node
                                }}/>
                            </FormIconField>

                            <FormIconField width="one-half" iconPosition="left" iconColor="default" iconKey="lock">
                                <FormInput type="password" placeholder="Passphrase" name="icon-alignment-left" ref={node => {
                                    passphraseInput = node
                                }}/>
                            </FormIconField>

                            <FormField width="one-half">
                                <Checkbox label="Cache KeyFile locally" ref={node => {
                                    cacheLocal = node
                                }}/>
                            </FormField>

                            <FormRow>
                                <ErrorComponentView error={this.props.error}/>
                            </FormRow>

                            <FormField>
                                <Button block size="sm" type="success" onClick={() => this.login()}>Login</Button>
                            </FormField>

                            <FormField>
                                <Button block size="sm" type="success" onClick={() => this.props.register()}>Register</Button>
                            </FormField>
                        </Form>
                    </Row>
                </Col>
            </Row>
        )
    }
}

LoginComponentView.PropTypes = {
    userId: React.PropTypes.string
};

export default LoginComponentView;