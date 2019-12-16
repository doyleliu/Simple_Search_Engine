import React, {Component} from "react";
import {Redirect} from 'react-router-dom';
import MenavBar from '../components/navBar/navBar';
import {Button} from 'react-bootstrap';
import {MDBInput} from "mdbreact";
import Logo from './logo.jpg'
import Icon from './down.png'
import 'antd/dist/antd.css';
import {Typography, Checkbox, Row, Col, Input, Table} from 'antd';

const { Title } = Typography;
const { Search } = Input;

class homePage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            query: "",
            natural_language_processing : true,
            computational_linguistics : true,
            linguistics : true,
            artificial_intelligence : true,
            education : true,
            mathematics : true,
            translation : true,
            formal_languages : true,
            semantics : true,
            data_mining : true, 
            all_val : true,
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
                    render: text => <a>{text}</a>
                },
                {
                    title: 'Abstracts',
                    dataIndex: 'abstracts',
                    key: 'abstracts',
                },
                {
                    title: 'Related Papers',
                    dataIndex: 'MoreRelatedPaper',
                    key: 'MoreRelatedPaper',
                },
                {
                    title: 'Relevance',
                    dataIndex: 'relevance',
                    key: 'relevance',

                },
                {
                    title: 'Relevent',
                    dataIndex: 'relevanceButton',
                    key: 'relevanceButton',

                },
                {
                    title: 'Irrelevant',
                    dataIndex: 'irrelevanceButton',
                    key: 'irrelevanceButton',
                }
                
            ],
            dataSource: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleCheckbox = this.handleCheckbox.bind(this);
    }

    handleChange(e) {
        if (e.target.name === "input") this.setState({query: e.target.value});
    }

    handleSubmit(targete) {
        console.log("Hit button!")
        this.setState({query: targete});
        let data = {
            query: targete
        };

        if(this.state.all_val === true)
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
                    let cur = 1;
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
                                <Button variant="light" onClick={e => this.changeRelevance(e, currData)}>Relevant</Button>;
                            paper.irrelevanceButton =
                                <Button variant="light" onClick={e => this.changeIrrelevance(e, currData)}>Irrelevant</Button>;
                            let moreRelatedPaper = [];
                            let cnt = 1;
                            for (let ob of response) {
                                moreRelatedPaper.push(" " + cnt + ". " + ob.titles + " ;");
                                cnt ++;
                                if(cnt > 5) break;
                            }
                            if(paper.abstracts.length > 500){
                                paper.abstracts = paper.abstracts.slice(0,500);
                                paper.abstracts += "...";
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

        else {
            data.topics = []
            if(this.state.natural_language_processing === true) data.topics.push("natural language processing");
            else if(this.state.computational_linguistics === true) data.topics.push("computational linguistics");
            else if(this.state.linguistics === true) data.topics.push("linguistics");
            else if(this.state.artificial_intelligence === true) data.topics.push("artificial intelligence");
            else if(this.state.education === true) data.topics.push("education");
            else if(this.state.mathematics === true) data.topics.push("mathematics");
            else if(this.state.translation === true) data.topics.push("translation (languages)'");
            else if(this.state.formal_languages === true) data.topics.push("formal languages");
            else if(this.state.semantics === true) data.topics.push("semantics");
            else if(this.state.data_mining === true) data.topics.push("data mining");
            console.log(data.topics);
            fetch(`/backend/researchArea`, {
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
                        let cur = 1;
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
                                    <Button variant="light" onClick={e => this.changeRelevance(e, currData) }>Relevant</Button>;
                                paper.irrelevanceButton =
                                    <Button variant="light" onClick={e => this.changeIrrelevance(e, currData)}>Irrelevant</Button>;
                                let moreRelatedPaper = [];
                                let cnt = 1;
                                for (let ob of response) {
                                    moreRelatedPaper.push(" " + cnt + ". " + ob.titles + " ;");
                                    cnt ++;
                                    if(cnt > 5) break;
                                }
                                if(paper.abstracts.length > 500){
                                    paper.abstracts = paper.abstracts.slice(0,500);
                                    paper.abstracts += "...";
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
    }

    handleCheckbox(e) {
        if(e.target.name === "natural language processing") {
            this.setState({
                natural_language_processing: !this.state.natural_language_processing,
            });
        }
        if(e.target.name === "computational linguistics") {
            this.setState({
                computational_linguistics: !this.state.computational_linguistics,
            });
        }
        if(e.target.name === "linguistics") {
            this.setState({
                linguistics: !this.state.linguistics,
            });
        }
        if(e.target.name === "artificial intelligence") {
            this.setState({
                artificial_intelligence: !this.state.artificial_intelligence,
            });
        }
        if(e.target.name === "education") {
            this.setState({
                education: !this.state.education,
            });
        }
        if(e.target.name === "mathematics") {
            this.setState({
                mathematics: !this.state.mathematics,
            });
        }
        if(e.target.name === "translation") {
            this.setState({
                translation: !this.state.translation,
            });
        }
        if(e.target.name === "formal languages") {
            this.setState({
                formal_languages: !this.state.formal_languages,
            });
        }
        if(e.target.name === "semantics") {
            this.setState({
                semantics: !this.state.semantics,
            });
        }
        if(e.target.name === "data mining") {
            this.setState({
                data_mining: !this.state.data_mining,
            });
        }
        if(e.target.name === "all_val") {
            this.setState({
                all_val: !this.state.all_val,
            });
        }
    }

    render() {
        global.constants = {
            usersElements: []
        };

        return (
            <div className='App'>
                <MenavBar></MenavBar>
                <link rel="stylesheet" href="https://bootswatch.com/4/lumen/bootstrap.css" media="screen"></link>
                <div>
                    <h5 style={{display:"inline"}}>Selected Areas</h5><img src={Icon}
                                                                           style={{width: "15px"}}
                                                                           onClick={e => this.toggleTopics(e)}></img>
                </div>
                <fieldset id={"top10topics"}>
                    <div className="checkbox">
                    <Checkbox name="all_val" type="checkbox" defaultChecked={this.state.all_val} onChange={this.handleCheckbox}/>
                    <label><h5>All Areas</h5></label>
                    </div>
                    <Row>
                    <Col span={6}>
                    <div className="checkbox">
                    <Checkbox name="natural language processing" type="checkbox" defaultChecked={this.state.natural_language_processing} onChange={this.handleCheckbox} />
                    <label>Natural Language Processing</label>
                    </div>
                    </Col>
                    <Col span={6}>
                    <div className="checkbox">
                    <Checkbox name="computational linguistics" type="checkbox" defaultChecked={this.state.computational_linguistics} onChange={this.handleCheckbox}/>
                    <label>Computational Linguistics</label>
                    </div>
                    </Col>
                    <Col span={6}>
                    <div className="checkbox">
                    <Checkbox name="linguistics" type="checkbox" defaultChecked={this.state.linguistics} onChange={this.handleCheckbox}/>
                    <label>Linguistics</label>
                    </div>
                    </Col>
                    <Col span={6}>
                    <div className="checkbox">
                    <Checkbox name="artificial intelligence" type="checkbox" defaultChecked={this.state.artificial_intelligence} onChange={this.handleCheckbox}/>
                    <label>Artificial Intelligence</label>
                    </div>
                    </Col>
                    <Col span={6}>
                    <div className="checkbox">
                    <Checkbox name="education" type="checkbox" defaultChecked={this.state.education} onChange={this.handleCheckbox}/>
                    <label>Education</label>
                    </div>
                    </Col>
                    <Col span={6}>
                    <div className="checkbox">
                    <Checkbox name="mathematics" type="checkbox" defaultChecked={this.state.mathematics} onChange={this.handleCheckbox}/>
                    <label>Mathematics</label>
                    </div>
                    </Col>
                    <Col span={6}>
                    <div className="checkbox">
                    <Checkbox name="translation" type="checkbox" defaultChecked={this.state.translation} onChange={this.handleCheckbox}/>
                    <label>Translation</label>
                    </div>
                    </Col>
                    <Col span={6}>
                    <div className="checkbox">
                    <Checkbox name="formal languages" type="checkbox" defaultChecked={this.state.formal_languages} onChange={this.handleCheckbox}/>
                    <label>Formal Languages</label>
                    </div>
                    </Col>
                    <Col span={6}>
                    <div className="checkbox">
                    <Checkbox name="semantics" type="checkbox" defaultChecked={this.state.semantics} onChange={this.handleCheckbox}/>
                    <label>Semantics</label>
                    </div>
                    </Col>
                    <Col span={6}>
                    <div className="checkbox">
                    <Checkbox name="data mining" type="checkbox" defaultChecked={this.state.data_mining} onChange={this.handleCheckbox}/>
                    <label>Data Mining</label>
                    </div>
                    </Col>
                    </Row>
                </fieldset>

                <center>
                    <img src={Logo}></img>
                    <Title level={4}>Search for papers in the domain of natural language processing</Title>
                    <br></br>
                    <Search
                        placeholder="input search text"
                        enterButton="Search"
                        size="large"
                        onSearch={this.handleSubmit}
                    />
                </center>

                <div> 
                    <div className="container">
                        <Table dataSource={this.state.dataSource}
                            columns={this.state.Columns}
                            rowKey="number"
                            size="small"
                            bordered
                            title={() => <center>Current Results</center>}/>
                    </div>
                </div>

            </div>


        )
    }

    toggleTopics(e) {
        e.preventDefault();
        let x = document.getElementById("top10topics");
        if (x.style.display === "none") {
            x.style.display = "block";
        } else {
            x.style.display = "none";
        }
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