import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import SimpleSearch from "./SimpleSearch";
import Suggestion from "./Suggestion";
import BeerDisplay from "./BeerDisplay";

//API for flags by country https://restcountries.eu/rest/v2/COUNTRYNAME/

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      results: {},
      resultsArray: [],
      alcName: "",
      suggestion: "",
      submitted: false
    };

    //Binding functions
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.displaySuggestion = this.displaySuggestion.bind(this);
    this.suggestionClick = this.suggestionClick.bind(this);
    this.apiCall = this.apiCall.bind(this);
    this.iterateThroughAlc = this.iterateThroughAlc.bind(this);
    this.originStrip = this.originStrip.bind(this);
    this.flagApiCall = this.flagApiCall.bind(this);
  }

  //SEARCH FUNCTIONS

  //this function will be called when the user submits their query. If no results are displayed, the app will save an alcohol suggestion with similar spelling

  handleSubmit(e) {
    //Not really sure if this is needed more than to prevent default, but I'll keep it here just in case
    e.preventDefault();
    this.setState({
      submitted: true
    });
  }
  //Test this
  //This function is the API call to the LCBO API
  apiCall() {
    axios({
      url: "https://lcboapi.com/products",
      params: {
        access_key:
          "MDoxNDEyMWE4Ni01ZGZiLTExZTgtYTVjYi1jN2JlMmFhMTZiNmQ6SzlralhKWGRwNWVXclp0R1VhcEJFNUU3WWRaTFVLTWkxRW5l",
        q: this.state.alcName
      }
    }).then(res => {
      this.setState({
        results: res.data.result,
        suggestion: res.data.suggestion
      });
    });
    console.log("here");
    this.iterateThroughAlc();
  }

  flagApiCall(country, alc) {
    axios({
      url: `https://restcountries.eu/rest/v2/name/${country}`
    }).then(res => {
      //This below will display all the data pretaining to country of the specific alcohol.
      //For now, all I am returning is the flag of the country in question
      let flag = res.data["0"].flag;
      alc["flag"] = flag;
    });
  }

  //Takes the input value from the searched beverage, and saves it in state -> new feature!!! when you type, it automatically searches the API for data. Super sweet dude.
  handleChange(e) {
    let text = e.target.value.trim();
    this.setState(
      {
        alcName: text
      },
      () => {
        this.state.alcName.length > 0 ? this.apiCall() : null;
      }
    );
  }

  //If user enters alcohol that isn't recognized, the program will recommend an alternate spelling
  displaySuggestion() {
    if (this.state.suggestion && this.state.submitted) {
      return (
        <Suggestion
          suggestion={this.state.suggestion}
          suggestionClick={this.suggestionClick}
        />
      );
    }
  }

  //If the user misspells their searched item (i.e. no results provided), they will be given a suggested beverage instead. This changes the state of the alcname to the suggested one
  suggestionClick() {
    let suggestion = this.state.suggestion;
    this.setState(
      {
        alcName: suggestion
      },
      () => this.apiCall()
    );
  }

  iterateThroughAlc() {
    //This function will take the user's query results, interate through them, and store the results in a new state to be displayed later on the page
    const resultsArray = [];
    for (let obj in this.state.results) {
      //The function below takes the country of origin (this.state.results[obj].origin) as that argument, and returns the country of origin with ", " stripped

      let country = this.originStrip(this.state.results[obj].origin);

      //The function below will take the alcohol object and country of origin of the alcohol in question and make an API call to the flag API. It will then be added to the object of the alcohol

      this.flagApiCall(country, this.state.results[obj]);

      resultsArray.push(this.state.results[obj]);
    }
    this.setState({
      resultsArray
    });
  }

  originStrip(origin) {
    //This function does exactly what it says, take the country of origin listed in the object, and returns just the country. no fluff added
    let country = "";
    for (let i in origin) {
      if (origin[i] != ",") {
        country += origin[i];
      } else {
        break;
      }
    }
    return country;
  }

  render() {
    return (
      <div>
        <SimpleSearch
          handleSubmit={this.handleSubmit}
          handleChange={this.handleChange}
        />

        {this.displaySuggestion()}
        {this.state.alcName.length > 0 ? (
          <BeerDisplay resultsArray={this.state.resultsArray} />
        ) : null}
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
