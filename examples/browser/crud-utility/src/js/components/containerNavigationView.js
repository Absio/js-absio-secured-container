import React from 'react';
import  {Row, Col} from 'react-flexbox-grid'

import { Button, InputGroup, FormInput, Glyph, FormField } from 'elemental';

class ContainerNavigationView extends React.Component {

    constructor(){
        super();
        this.state={
          searchString:''
        };
        this.searchInputChanged = this.searchInputChanged.bind(this);
    }

    searchInputChanged(e){
        this.setState({ searchString: e.target.value })
    }

    render() {
        return (
            <div className="navigation-view">
                <Row>
                    <Col xs={12}>
                        <Row end="xs">
                            <Col xs={4}>
                                <div className="inline-controls">

                                    <Button size="sm" type="success" onClick={this.props.showLoadNewFileModal}>Load new file</Button>
                                </div>
                            </Col>
                            <Col xs={4}>
                                <InputGroup contiguous>
                                    <InputGroup.Section grow>
                                        <FormInput size="sm" type="text" onChange={this.searchInputChanged} placeholder="Input container id"/>
                                    </InputGroup.Section>

                                    <InputGroup.Section>
                                        <Button size="sm" onClick={e => {this.props.searchById(this.state.searchString)}}>
                                            <span className="octicon octicon-search" />
                                        </Button>
                                    </InputGroup.Section>
                                </InputGroup>
                            </Col>
                            <Col>
                                <Button size="sm" type="primary" onClick={this.props.refreshContainers}><Glyph icon="sync"/></Button>
                            </Col>
                        </Row>
                    </Col>
                </Row>
            </div>
        );
    }
}

export default ContainerNavigationView;