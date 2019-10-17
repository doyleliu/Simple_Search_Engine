import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import MenavBar from '../components/navBar/navBar';
import { Button} from 'react-bootstrap';

class homePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query : ""
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e){
    if(e.target.name === "input")this.setState({query:e.target.value});
  }

  handleSubmit(e) {
    console.log("Hit button!");
    var data = {
      query : this.state.query
    }

    fetch(`/backend/queryPaper`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers:{
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials':true,
        'Access-Control-Allow-Methods':'POST, GET',
        "Content-Type": "application/json"
      }
    }).then(res => res.json())
    .then(response => {
      if(response.Status == "Flase"){
          alert("Invalid!");
      }
      else{
          console.log(response);
      }
    })
    .catch(error=> console.log('Error:', error))
  }

  render() {
    return(
      <div className='App'>
        <MenavBar></MenavBar>

        <form>
          <label>
            ACL Paper Search:
            <li>Search for papers in the domain of natural language processing</li>
            
            <br></br>
            <input type="text" name="input" style={{width: "370px"}} onChange={this.handleChange} defaultValue=""/>
          </label>
          
          <input type="button" onClick = {this.handleSubmit} value="Search" />
        </form>

      </div>
    
  )}

}

export { homePage }; 