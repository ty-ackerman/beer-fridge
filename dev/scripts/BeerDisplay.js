import React from "react";

class BeerDisplay extends React.Component {
  //This component will take the object containing all alcohols and display them on the page

  render() {
    return (
      <React.Fragment>
        <ul>
          {this.props.resultsArray.map((alc, key) => {
            return (
              <div>
                <li key={key} className={alc.id}>
                  {alc.name} {alc.flag}
                </li>
                {/* <img src={() => alc.flag} alt="country flag" /> */}
              </div>
            );
          })}
        </ul>
      </React.Fragment>
    );
  }
}

export default BeerDisplay;
