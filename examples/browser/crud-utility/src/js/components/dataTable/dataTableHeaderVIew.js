import React from 'react'

class DataTableHeaderView extends React.Component {
    render() {
        return (
            <tr>
                <th>Container ID</th>
                <th>Container Type</th>
                <th>Last Modified At</th>
                <th>Expired At</th>
                <th>Info</th>
                <th>Actions</th>
            </tr>
        )}
}

export  default  DataTableHeaderView;