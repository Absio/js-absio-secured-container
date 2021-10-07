import React from "react";
import LoadingView from "./loadingView";

class MainView extends React.Component<any> {
  render() {
    return (
      <div className="Main">
        <LoadingView loading={this.props.loading} />
        {this.props.child}
      </div>
    );
  }
}

export default MainView;
