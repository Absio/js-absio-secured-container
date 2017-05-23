import React from 'react';
import HeaderContainer from '../containers/headerContainer';
import DataTableContainer from '../containers/dataTable/dataTableContainer';
import ContainerNavigationContainer from '../containers/containerNavigationContainer';
import UpdateAccessModalContainer from '../containers/modals/updateAccessModalContainer';
import ContainerInfoModalContainer from '../containers/modals/containerInfoModalContainer';
import DeleteContainerModalContainer from '../containers/modals/deleteContainerModalContainer';
import UpdateContainerModalContainer from '../containers/modals/updateContainerModalContainer';
import LoadNewFileModalContainer from '../containers/modals/loadNewFIleModalContainer';
import ErrorComponentView from './errorView';

class MainGridView extends React.Component {

    render() {
        return (
            <div className="grid-view">
                <HeaderContainer/>
                <ContainerNavigationContainer/>
                <ErrorComponentView error={this.props.error}/>
                <DataTableContainer/>
                <UpdateAccessModalContainer/>
                <ContainerInfoModalContainer/>
                <DeleteContainerModalContainer/>
                <UpdateContainerModalContainer/>
                <LoadNewFileModalContainer/>
            </div>
        );
    }
}

export default MainGridView;