import React from "react";
// import AdvancedSearch from "./AdvancedSearch";

class SimpleSearch extends React.Component {
  render() {
    return (
      <React.Fragment>
        <form action="" onSubmit={this.props.handleSubmit}>
          <input type="text" onChange={this.props.handleChange} />
          {/* <AdvancedSearch/> */}
          <input type="submit" value="Search For Alcohol" />
        </form>
      </React.Fragment>
    );
  }
}

export default SimpleSearch;
