import React, {Component} from "react";
import {Redirect} from 'react-router-dom';
import MenavBar from '../components/navBar/navBar';
import {Button} from 'react-bootstrap';
import {Table} from 'antd';
import 'antd/dist/antd.css';

class homePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query: "",
            Columns: [
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

                },
                {
                    title: 'RelevanceButton',
                    dataIndex: 'relevanceButton',
                    key: 'relevanceButton',

                },
                {
                    title: 'IrrelevanceButton',
                    dataIndex: 'irrelevanceButton',
                    key: 'irrelevanceButton',
                },
                {
                    title: 'MoreRelatedPaper',
                    dataIndex: 'MoreRelatedPaper',
                    key: 'MoreRelatedPaper',
                }
            ],
            dataSource: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        if (e.target.name === "input") this.setState({query: e.target.value});
    }

    handleSubmit() {
        console.log("Hit button!");
        let data = {
            query: this.state.query
        };

        fetch(`/backend/queryPaper`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Methods': 'POST, GET',
                "Content-Type": "application/json"
            }
        }).then(res => res.json())
            .then(response => {
                if (response.Status === "False") {
                    alert("Invalid!");
                } else {
                    let cur = 0;
                    let fetches = [];
                    for (let paper of response) {
                        paper.number = cur;
                        cur++;
                        fetches.push(fetch(`/backend/recommendPaper`, {
                            method: 'POST',
                            body: JSON.stringify(paper),
                            headers: {
                                'Access-Control-Allow-Origin': '*',
                                'Access-Control-Allow-Credentials': true,
                                'Access-Control-Allow-Methods': 'POST, GET',
                                "Content-Type": "application/json"
                            }
                        }).then(res => res.json())
                        .then(response => {
                            paper.relevance = 0;
                            let currData = {
                                query: this.state.query,
                                document_title: paper.titles,
                            };
                            paper.relevanceButton =
                                <button onClick={e => this.changeRelevance(e, currData)}>Relevant</button>;
                            paper.irrelevanceButton =
                                <button onClick={e => this.changeIrrelevance(e, currData)}>Irrelevant</button>;
                            let moreRelatedPaper = [];
                            let cnt = 1;
                            for (let ob of response) {
                                moreRelatedPaper.push(" " + cnt + ". " + ob.titles + " ;");
                                cnt ++;
                                if(cnt > 5) break;
                            }
                            paper.MoreRelatedPaper = moreRelatedPaper;
                            global.constants.usersElements.push(paper);
                        }))

                        Promise.all(fetches.map(p => p.catch(e => e)))
                        .then(results => console.log(results))
                        .catch(e => console.log(e))
                    }
                }
            })
            .then(response => {
                setTimeout(function () {
                    global.constants.usersElements.sort((a, b) => (a.number > b.number) ? 1 : -1)
                    this.setState({dataSource: global.constants.usersElements});
                }.bind(this), 300);
            })
            .catch(error => console.log('Error:', error))
    }

    render() {
        global.constants = {
            usersElements: []
        };

        return (
            <div className='App'>
                <MenavBar></MenavBar>
                <link rel="stylesheet" href="https://bootswatch.com/4/lumen/bootstrap.css" media="screen"></link>
                <form>
                    <label>
                        ACL Paper Search:
                        <li>Search for papers in the domain of natural language processing</li>
                        <br></br>
                        <input type="text" name="input" style={{width: "370px"}} onChange={this.handleChange}
                               defaultValue=""/>
                    </label>

                    <input type="button" onClick={this.handleSubmit} value="Search"/>
                </form>

                <div>
                    Current Results

                    <div className="container">
                        <Table dataSource={this.state.dataSource}
                               columns={this.state.Columns}
                               rowKey="number"/>
                    </div>
                </div>

            </div>


        )
    }

    changeRelevance(e, currData) {
        e.preventDefault();
        let data = {
            query: currData.query,
            document_title: currData.document_title,
            relevance: 1,
        };
        fetch(`/backend/queryDocRel`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Methods': 'POST, GET',
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                if (response.Status === "False") {
                    alert("Invalid!");
                } else {
                    console.log('posted relevant doc to sql: ', currData.document_title);
                }
            })
            .catch(error => console.log('Error:', error))
    }

    changeIrrelevance(e, currData) {
        e.preventDefault();
        let data = {
            query: currData.query,
            document_title: currData.document_title,
            relevance: 0,
        };
        fetch(`/backend/queryDocRel`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Credentials': true,
                'Access-Control-Allow-Methods': 'POST, GET',
                "Content-Type": "application/json"
            }
        })
            .then(response => {
                if (response.Status === "False") {
                    alert("Invalid!");
                } else {
                    console.log('posted irrelevant doc to sql: ', currData.document_title);
                }
            })
            .catch(error => console.log('Error:', error))
    }

}

export {homePage};