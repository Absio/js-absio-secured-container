import Loader from "halogen/BounceLoader";
import React from "react";

class LoadingComponentView extends React.Component<any> {
  static propTypes = {
    loading: React.PropTypes.bool.isRequired,
  };
  render() {
    if (!this.props.loading) {
      return null;
    }

    return (
      <div className="loading-container">
        <div className="loading-view">
          <Loader color="#26A65B" size="100px" />
        </div>
      </div>
    );
  }
}

export default LoadingComponentView;
