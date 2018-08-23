import React from "react";

class Suggestion extends React.Component {
  render() {
    return (
      <React.Fragment>
        <p>
          Did you mean{" "}
          <span className="suggestion" onClick={this.props.suggestionClick}>
            {this.props.suggestion}
          </span>
          ?
        </p>
      </React.Fragment>
    );
  }
}

export default Suggestion;
