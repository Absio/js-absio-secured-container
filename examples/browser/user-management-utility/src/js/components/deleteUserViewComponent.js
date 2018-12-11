import React from 'react';
import {Row} from 'react-flexbox-grid';
import '../../css/form-custom-style.css';

import {
    Button,
    FormRow,
    FormField,
    Form
} from 'elemental';


import ErrorComponentView from './errorView';


class DeleteUserComponentView extends React.Component {

    render() {
        return (
            <div>
                <Row center="xs">
                    <Form className="small-form-style tab-form-style">
                        <FormField>
                            <Button block size="sm" type="success" onClick={() => this.props.deleteUser()}>
                                Delete Current User
                            </Button>
                        </FormField>

                        <FormRow>
                            <ErrorComponentView error={this.props.error}/>
                        </FormRow>

                    </Form>
                </Row>
            </div>
        );
    }
}

export default DeleteUserComponentView;