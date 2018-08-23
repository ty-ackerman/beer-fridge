import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import SimpleSearch from "./SimpleSearch";
import Suggestion from "./Suggestion";
import BeerDisplay from "./BeerDisplay";

//API for flags by country https://restcountries.eu/#api-endpoints-language

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      results: {},
      alcName: "",
      suggestion: ""
    };

    //Binding functions
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.displaySuggestion = this.displaySuggestion.bind(this);
    this.suggestionClick = this.suggestionClick.bind(this);
    this.apiCall = this.apiCall.bind(this);
    this.displayAlc = this.displayAlc.bind(this);
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
      this.setState({
        results: res.data.result,
        suggestion: res.data.suggestion
      });
    });
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

  displayAlc() {
    if (this.state.results) {
      console.log(this.state.results);
    }
    return null;
  }

  render() {
    return (
      <div>
        <SimpleSearch
          handleSubmit={this.handleSubmit}
          handleChange={this.handleChange}
        />
        {this.displaySuggestion()}
        <BeerDisplay
          results={this.state.results}
          displayAlc={this.displayAlc}
        />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("app"));
