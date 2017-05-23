import React from 'react';
import { Row, Col } from 'react-flexbox-grid';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ChangePasswordContainer from '../containers/changePasswordContainer';
import ChangeBackupCredentialsContainer from '../containers/changeBackupCredentialsContainer';
import DeleteUserContainer from '../containers/deleteUserContainer';
import{ Alert, Button } from 'elemental'

class TabViewComponent  extends React.Component {

    constructor(){
        super();
        this.handleSelect = this.handleSelect.bind(this);
    }

    handleSelect(index, last){
        this.props.tabChanged();
    }

    render () {
        return (
            <div>
                <Row>
                    <Col xs={12}>
                        <Row center="xs">
                            <div className="tab-container">
                                <Row center="xs">
                                    <Alert type="success"> UserId: {this.props.userId} </Alert>
                                    <Button className="logout-button" type="hollow-warning" onClick={(e) => this.props.logOut()}>Logout</Button>
                                </Row>
                                <Tabs
                                    onSelect={this.handleSelect}
                                    selectedIndex={0}
                                >
                                    <TabList>
                                        <Tab>Change Password</Tab>
                                        <Tab>Change Backup Credentials</Tab>
                                        <Tab>Delete user</Tab>
                                    </TabList>

                                    <TabPanel>
                                      <ChangePasswordContainer/>
                                    </TabPanel>

                                    <TabPanel>
                                        <ChangeBackupCredentialsContainer/>
                                    </TabPanel>

                                    <TabPanel>
                                        <DeleteUserContainer/>
                                    </TabPanel>
                                </Tabs>
                            </div>
                        </Row>
                    </Col>
                </Row>
            </div>
        );}
}

TabViewComponent.PropTypes = {
    userId: React.PropTypes.string.isRequired
};

export default TabViewComponent;
