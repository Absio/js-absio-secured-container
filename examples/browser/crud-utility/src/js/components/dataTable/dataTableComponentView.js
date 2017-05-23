import React from 'react';
import  { Table } from  'elemental';
import HeaderTableView from './dataTableHeaderVIew';
import DataTableRowView from './dataTableRowComponentView';

class DataTableView extends React.Component {

    constructor(){
        super();
        this.createTableRows = this.createTableRows.bind(this);
    }

    createTableRows(){
        let modalCallback = this.props.showModal;

        return this.props.containerArray.map(function (container) {
          return  <DataTableRowView
                  key={container.containerId}
                  containerID={container.containerId}
                  containerType={container.containerType}
                  lastModifiedAt={container.containerModifiedAt}
                  expiredAt={container.containerModifiedAt}
                  onModalCall={ modalCallback }
            />
        });
    }

    render() {
        return (
            <div className="data-table-view">
                <Table>
                    <colgroup>
                        <col width="" />
                        <col width="15%" />
                        <col width="15%" />
                        <col width="12%" />
                        <col width="5%" />
                        <col width="5%" />
                    </colgroup>
                    <thead>
                        <HeaderTableView/>
                    </thead>
                    <tbody>
                    { this.props.containerArray.length > 0 ?  this.createTableRows() : null }
                    </tbody>
                </Table>
            </div>
        );
    }
}

DataTableView.PropTypes = {
    containerArray: React.PropTypes.array.isRequired
};

export default DataTableView;