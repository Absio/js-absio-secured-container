import React from 'react';
import  { Button } from  'elemental';
import { Row, Col } from 'react-flexbox-grid';
class HeaderView extends React.Component {

    render() {
        return (
            <div className="header-view">
                <Row between="xs" middle="sm">
                        <Col xs={3}>
                            <div>Absio Secured Container</div>
                        </Col>

                        <Col xs={5}>
                            <div>Signed is as {this.props.userId} </div>
                        </Col>

                        <Col xs={2} >
                            <Button size="sm" type="hollow-success" onClick={(e) => this.props.logout()}>Log Out</Button>
                        </Col>
                </Row>
            </div>
        );
    }
}

HeaderView.PropTypes = {
    userId:React.PropTypes.string.isRequired
};

export default HeaderView;