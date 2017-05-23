import React from 'react';
import Loader  from 'halogen/BounceLoader';

class LoadingComponentView  extends React.Component {

    render () {

        if (!this.props.loading) {
            return null;
        }

        return (
            <div className = 'loading-container'>
                <div className="loading-view">
                    <Loader color="#26A65B" size="100px"/>
                </div>
            </div>
        )};
}

LoadingComponentView.PropTypes = {
  loading: React.PropTypes.bool.isRequired
};

export default LoadingComponentView;