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
      suggestion: ""
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
    e.preventDefault();
    this.apiCall();
  }

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
      this.setState(
        {
          results: res.data.result,
          suggestion: res.data.suggestion
        },
        () => {
          //Once the API call is made, the iterateThroughAlc function is called which will save the alc in an array
          this.iterateThroughAlc();
        }
      );
    });
  }

  flagApiCall(country, alc) {
    axios({
      url: `https://restcountries.eu/rest/v2/name/${country}`
    }).then(
      res => {
        //This below will display all the data pretaining to country of the specific alcohol.
        //For now, all I am returning is the flag of the country in question
        let flag = res.data["0"].flag;
        alc["flag"] = flag;
      },
      () => {}
    );
  }

  //Takes the input value from the searched beverage, and saves it in state
  handleChange(e) {
    let text = e.target.value;
    this.setState({
      alcName: text
    });
  }

  //If user enters alcohol that isn't recognized, the program will recommend an alternate spelling
  displaySuggestion() {
    if (this.state.suggestion) {
      return (
        <Suggestion
          suggestion={this.state.suggestion}
          suggestionClick={this.suggestionClick}
        />
      );
    }
  }

  //If the user misspells their searched item (i.e. no results provided), they will be given a suggested beverage instead
  suggestionClick() {
    let suggestion = this.state.suggestion;
    this.setState(
      {
        alcName: suggestion
      },
      () => {
        this.apiCall();
      }
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
    this.setState(
      {
        resultsArray
      },
      () => {
        console.log(this.state.resultsArray);
      }
    );
  }

  originStrip(origin) {
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
        <BeerDisplay resultsArray={this.state.resultsArray} />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
