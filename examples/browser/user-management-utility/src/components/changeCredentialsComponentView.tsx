import {
  Alert,
  Button,
  Checkbox,
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

let newPasswordInput: HTMLFormElement;
let newPassphraseInput: HTMLFormElement;
let newReminderInput: HTMLFormElement;
let cacheLocal: HTMLFormElement;

class ChangeCredentials extends React.Component<any> {
  static propTypes = {
    reminderString: React.PropTypes.string.isRequired,
  };
  changeCredentials() {
    this.props.changeCredentials(
      newPasswordInput.refs.input.value,
      newPassphraseInput.refs.input.value,
      newReminderInput.refs.input.value,
      cacheLocal.refs.target.checked
    );
  }

  componentDidUpdate() {
    if (this.props.backupChanged) {
      newPasswordInput.refs.input.value = "";
      newPassphraseInput.refs.input.value = "";
      newReminderInput.refs.input.value = "";
    }
  }

  componentDidMount() {
    newReminderInput.refs.input.value = this.props.reminderString;
  }

  render() {
    return (
      <Row>
        <Col xs={12}>
          <Row center="xs">
            <Form className="small-form-style tab-form-style">
              <FormIconField
                width="one-half"
                iconPosition="left"
                iconColor="default"
                iconKey="key"
              >
                <FormInput
                  type="password"
                  placeholder="New Password"
                  name="icon-alignment-left"
                  ref={(node: any) => {
                    newPasswordInput = node;
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
                  placeholder="New Reminder"
                  name="icon-alignment-left"
                  ref={(node: any) => {
                    newReminderInput = node;
                  }}
                />
              </FormIconField>

              <FormIconField
                width="one-half"
                iconPosition="left"
                iconColor="default"
                iconKey="key"
              >
                <FormInput
                  type="password"
                  placeholder="New Passphrase"
                  name="icon-alignment-left"
                  ref={(node: any) => {
                    newPassphraseInput = node;
                  }}
                />
              </FormIconField>

              <FormField width="one-half">
                <Checkbox
                  label="Cache KeyFile locally"
                  ref={(node: any) => {
                    cacheLocal = node;
                  }}
                />
              </FormField>

              <FormRow>
                <ErrorComponentView error={this.props.error} />
              </FormRow>

              {this.props.backupChanged && (
                <FormRow>
                  <Alert type="info">Credentials changed successfully</Alert>
                </FormRow>
              )}

              <FormField>
                <Button
                  block
                  size="sm"
                  type="success"
                  onClick={() => this.changeCredentials()}
                >
                  Change Credentials
                </Button>
              </FormField>
            </Form>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default ChangeCredentials;
