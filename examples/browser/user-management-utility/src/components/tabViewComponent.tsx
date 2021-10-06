import { Alert, Button } from "elemental";
import React from "react";
import { Col, Row } from "react-flexbox-grid";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import ChangeCredentialsContainer from "../containers/changeCredentialsContainer";
import DeleteUserContainer from "../containers/deleteUserContainer";
import SynchronizeAccountContainer from "../containers/synchronizeAccountContainer";

class TabViewComponent extends React.Component<any> {
  static propTypes = {
    userId: React.PropTypes.string.isRequired,
  };
  handleSelect() {
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
                  <Button
                    className="logout-button"
                    type="hollow-warning"
                    onClick={(e: any) => this.props.logOut()}
                  >
                    Logout
                  </Button>
                </Row>
                <Tabs onSelect={() => this.handleSelect()} selectedIndex={0}>
                  <TabList>
                    <Tab>Change Credentials</Tab>
                    <Tab>Synchronize account</Tab>
                    <Tab>Delete user</Tab>
                  </TabList>

                  <TabPanel>
                    <ChangeCredentialsContainer />
                  </TabPanel>

                  <TabPanel>
                    <SynchronizeAccountContainer />
                  </TabPanel>

                  <TabPanel>
                    <DeleteUserContainer />
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

export default TabViewComponent;
