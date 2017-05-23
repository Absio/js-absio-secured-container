import React from 'react';
import { Button, Dropdown } from  'elemental';
import { containerActions } from '../../actions/containerActions';

const defaultActions = [
    { label: 'Update Access', value: containerActions.SHOW_UPDATE_ACCESS_MODAL},
    { label: 'Delete', value: containerActions.SHOW_DELETE_MODAL},
    { label: 'Update Container',value: containerActions.SHOW_UPDATE_CONTAINER_MODAL },
    { type: 'divider' },
    { label: 'Open', value: containerActions.OPEN_FILE_FROM_CONTAINER }
];

class DataTableRowView extends React.Component {

    constructor(){
        super();
        this.callModal = this.callModal.bind(this);
    }

    callModal(actionType){
        this.props.onModalCall(actionType, this.props.containerID);
    }

    render() {
        return (
            <tr>
                <td>
                    <label>
                        { this.props.containerID }
                    </label>
                </td>
                <td>
                    {this.props.containerType}
                </td>
                <td>
                    {this.props.lastModifiedAt}
                </td>
                <td>
                    { this.props.expiredAt }
                </td>
                <td>
                    <Button type="link-primary"
                            onClick={e => this.callModal(containerActions.SHOW_CONTAINER_INFO_MODAL, this.props.containerID)}>Info</Button>
                </td>
                <td>
                    <Dropdown onSelect = { type => this.callModal(type, this.props.containerID)}
                        buttonType="link-success" items={defaultActions} buttonLabel="Actions"/>
                </td>
            </tr>
        );
    }
}

DataTableRowView.PropTypes = {
    containerID: React.PropTypes.string.isRequired,
    containerType:React.PropTypes.string.isRequired,
    lastModifiedAt: React.PropTypes.string.isRequired,
    expiredAt: React.PropTypes.string.isRequired,
    onModalCall: React.PropTypes.func.isRequired
};

export default DataTableRowView;