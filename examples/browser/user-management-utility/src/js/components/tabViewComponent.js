import React from 'react';
import {Row, Col} from 'react-flexbox-grid';
import {Tab, Tabs, TabList, TabPanel} from 'react-tabs';
import ChangeCredentialsContainer from '../containers/changeCredentialsContainer';
import SynchronizeAccountContainer from '../containers/synchronizeAccountContainer';
import DeleteUserContainer from '../containers/deleteUserContainer';
import {Alert, Button} from 'elemental';

class TabViewComponent extends React.Component {

    handleSelect(index, last) {
        this.props.tabChanged();
    }

    render() {
        return (
            <div>
                <Row>
                    <Col xs={12}>
                        <Row center="xs">
                            <div className="tab-container">
                                <Row center="xs">
                                    <Alert type="success"> UserId: {this.props.userId} </Alert>
                                    <Button className="logout-button" type="hollow-warning"
                                            onClick={(e) => this.props.logOut()}>Logout</Button>
                                </Row>
                                <Tabs
                                    onSelect={() => this.handleSelect()}
                                    selectedIndex={0}
                                >
                                    <TabList>
                                        <Tab>Change Credentials</Tab>
                                        <Tab>Synchronize account</Tab>
                                        <Tab>Delete user</Tab>
                                    </TabList>

                                    <TabPanel>
                                        <ChangeCredentialsContainer/>
                                    </TabPanel>

                                    <TabPanel>
                                        <SynchronizeAccountContainer/>
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
        );
    }
}

TabViewComponent.PropTypes = {
    userId: React.PropTypes.string.isRequired
};

export default TabViewComponent;
