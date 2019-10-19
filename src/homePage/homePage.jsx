import React, { Component } from "react";
import { Redirect } from 'react-router-dom';
import MenavBar from '../components/navBar/navBar';
import { Button} from 'react-bootstrap';
import {Table} from 'antd';
import 'antd/dist/antd.css';

class homePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      query : "",
      Columns : [
      {
          title: 'Number',
          dataIndex: 'number',
          key: 'number',
      },
      {
        title: 'Titles',
        dataIndex: 'titles',
        key: 'titles',
    },
    {
        title: 'Abstracts',
        dataIndex: 'abstracts',
        key: 'abstracts',
    },
    {
        title: 'Relevance',
        dataIndex: 'relevance',
        key: 'relevance',

    }
    ],
      dataSource : []
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
          var cur = 1;
          for(let paper of response) {
            paper.number = cur;
            paper.relevance = 0;
            global.constants.usersElements.push(paper);
            console.log('paper: ',paper);
            cur ++ ;
          }
          this.setState({dataSource:global.constants.usersElements});
          console.log(global.constants.usersElements)
      }
    })
    .catch(error=> console.log('Error:', error))
  }

  render() {
    global.constants = {
      usersElements : []
    }

    return(
      <div className='App'>
        <MenavBar></MenavBar>
        <link rel="stylesheet" href="https://bootswatch.com/4/lumen/bootstrap.css" media="screen"></link>
        <form>
          <label>
            ACL Paper Search:
            <li>Search for papers in the domain of natural language processing</li>
            
            <br></br>
            <input type="text" name="input" style={{width: "370px"}} onChange={this.handleChange} defaultValue=""/>
          </label>

          <input type="button" onClick = {this.handleSubmit} value="Search" />
        </form>

        <div>
            Current Results
            
          <div className="container">
            <Table dataSource = {this.state.dataSource} 
                        columns = {this.state.Columns} 
                        rowKey="number"/>
          </div> 
        </div>

      </div>

    
  )}

}

export { homePage }; 