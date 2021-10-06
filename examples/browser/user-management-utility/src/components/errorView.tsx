import { Alert } from "elemental";
import React from "react";

class ErrorComponentView extends React.Component<any> {
  static propTypes = {
    error: React.PropTypes.object.isRequired,
  };
  render() {
    if (!this.props.error) {
      return null;
    }

    return (
      <Alert type="danger">
        <div className="error-container">
          <strong>Error:</strong> {this.props.error.message}
        </div>
      </Alert>
    );
  }
}

export default ErrorComponentView;
