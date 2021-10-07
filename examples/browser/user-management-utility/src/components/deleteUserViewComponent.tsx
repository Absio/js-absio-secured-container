import { Button, Form, FormField, FormRow } from "elemental";
import React from "react";
import { Row } from "react-flexbox-grid";
import "../styles/form-custom-style.css";
import ErrorComponentView from "./errorView";

class DeleteUserComponentView extends React.Component<any> {
  render() {
    return (
      <div>
        <Row center="xs">
          <Form className="small-form-style tab-form-style">
            <FormField>
              <Button
                block
                size="sm"
                type="success"
                onClick={() => this.props.deleteUser()}
              >
                Delete Current User
              </Button>
            </FormField>

            <FormRow>
              <ErrorComponentView error={this.props.error} />
            </FormRow>
          </Form>
        </Row>
      </div>
    );
  }
}

export default DeleteUserComponentView;
