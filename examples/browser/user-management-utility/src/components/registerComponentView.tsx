import {
  Button,
  Form,
  FormField,
  FormIconField,
  FormInput,
  FormRow,
} from "elemental";
import React from "react";
import { Col, Row } from "react-flexbox-grid";
import "../styles/form-custom-style.css";
import ErrorComponentView from "./errorView";

let reminderInput: HTMLFormElement;
let passwordInput: HTMLFormElement;
let passphraseInput: HTMLFormElement;

class RegisterComponentView extends React.Component<any> {
  register() {
    this.props.register(
      passwordInput.refs.input.value,
      reminderInput.refs.input.value,
      passphraseInput.refs.input.value
    );
  }

  render() {
    return (
      <Row>
        <Col xs={12}>
          <Row center="xs">
            <Form className="small-form-style">
              <FormRow>
                <h4>
                  <b>Absio Secured Container</b>
                </h4>
                <h4>
                  <b>Register New User</b>
                </h4>
              </FormRow>

              <FormIconField
                width="one-half"
                iconPosition="left"
                iconColor="default"
                iconKey="lock"
              >
                <FormInput
                  type="password"
                  placeholder="Password"
                  name="icon-alignment-left"
                  ref={(node: any) => {
                    passwordInput = node;
                  }}
                />
              </FormIconField>

              <FormIconField
                width="one-half"
                iconPosition="left"
                iconColor="default"
                iconKey="question"
              >
                <FormInput
                  placeholder="Reminder"
                  name="icon-alignment-left"
                  ref={(node: any) => {
                    reminderInput = node;
                  }}
                />
              </FormIconField>

              <FormIconField
                width="one-half"
                iconPosition="left"
                iconColor="default"
                iconKey="lock"
              >
                <FormInput
                  type="password"
                  placeholder="Passphrase"
                  name="icon-alignment-left"
                  ref={(node: any) => {
                    passphraseInput = node;
                  }}
                />
              </FormIconField>

              <FormRow>
                <ErrorComponentView error={this.props.error} />
              </FormRow>

              <FormField>
                <Button
                  block
                  size="sm"
                  type="success"
                  onClick={() => this.register()}
                >
                  Register
                </Button>
              </FormField>

              <FormField>
                <Button
                  block
                  size="sm"
                  type="default"
                  onClick={() => this.props.cancel()}
                >
                  Cancel
                </Button>
              </FormField>
            </Form>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default RegisterComponentView;
