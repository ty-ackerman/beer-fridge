import React from "react";

class BeerDisplay extends React.Component {
  render() {
    return <React.Fragment>{this.props.displayAlc()}</React.Fragment>;
  }
}

export default BeerDisplay;
