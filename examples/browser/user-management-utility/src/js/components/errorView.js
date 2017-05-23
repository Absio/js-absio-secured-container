import React from 'react';
import { Alert } from 'elemental'


class ErrorComponentView  extends React.Component {

    render () {

        if (!this.props.error) {
            return null;
        }

        return (
            <Alert type="danger">
                <div className="error-container">
                    <strong>Error:</strong> {this.props.error.message}
                </div>
            </Alert>
        )};
}

ErrorComponentView.PropTypes = {
    error: React.PropTypes.object.isRequired
};

export default ErrorComponentView;