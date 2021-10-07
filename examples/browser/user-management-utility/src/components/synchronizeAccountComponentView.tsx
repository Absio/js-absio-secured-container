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

let passwordInput: HTMLFormElement;
let passphraseInput: HTMLFormElement;
let cacheLocal: HTMLFormElement;

class SynchronizeAccount extends React.Component<any> {
  static propTypes = {
    needToSync: React.PropTypes.string.isRequired,
  };
  synchronize() {
    this.props.synchronizeAccount(
      passphraseInput.refs.input.value,
      passwordInput.refs.input.value,
      cacheLocal.refs.target.checked
    );
  }

  componentDidUpdate() {
    if (this.props.synced) {
      passwordInput.refs.input.value = "";
      passphraseInput.refs.input.value = "";
    }
  }

  render() {
    return (
      <Row>
        <Col xs={12}>
          <Row center="xs">
            <Form className="small-form-style tab-form-style">
              <FormRow>
                <ErrorComponentView error={this.props.error} />
              </FormRow>

              {this.props.needToSync === false && (
                <FormRow>
                  <Alert type="info">Already synced</Alert>
                </FormRow>
              )}

              {this.props.needToSync === true && (
                <FormRow>
                  <Alert type="info">Not synced</Alert>
                </FormRow>
              )}

              <FormField>
                <Button
                  block
                  size="sm"
                  type="success"
                  onClick={(e: any) => this.props.needToSyncAccount()}
                >
                  Need to sync account?
                </Button>
              </FormField>

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

              <FormField width="one-half">
                <Checkbox
                  label="Cache KeyFile locally"
                  ref={(node: any) => {
                    cacheLocal = node;
                  }}
                />
              </FormField>

              {this.props.synced && (
                <FormRow>
                  <Alert type="info">Account synchronized successfully</Alert>
                </FormRow>
              )}

              <FormField>
                <Button
                  block
                  size="sm"
                  type="success"
                  onClick={() => this.synchronize()}
                >
                  Synchronize Account
                </Button>
              </FormField>
            </Form>
          </Row>
        </Col>
      </Row>
    );
  }
}

export default SynchronizeAccount;
