import React from 'react';
import ReactDOM from 'react-dom';
import axios from "axios"
import SimpleSearch from "./SimpleSearch"

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      results: {},
      alcName: "",
    }

    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }
  
  //SEARCH FUNCTIONS

  //this function will be called when the user submits their query. They will be able to search for their alcohol with advanced settings
  handleSubmit(e) {
    e.preventDefault();
    axios({
      url: "https://lcboapi.com/products",
      params: {
        access_key:
          "MDoxNDEyMWE4Ni01ZGZiLTExZTgtYTVjYi1jN2JlMmFhMTZiNmQ6SzlralhKWGRwNWVXclp0R1VhcEJFNUU3WWRaTFVLTWkxRW5l",
        q: this.state.alcName
      }
    }).then(res => {
      console.log(res)
      this.setState({
        results: res.data.result
      }, () => {console.log(this.state.results)});
    });
  }

  handleChange(e) {
    let text = e.target.value;
    this.setState({
      alcName: text
    })
  }




  render() {
    return (
      <div>
        <SimpleSearch handleSubmit = {this.handleSubmit} handleChange = {this.handleChange}/>
      </div>
    )
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
