import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Switch } from 'react-router-dom';

import {homePage} from './homePage/homePage';


class App extends React.Component {
  render() {
    return (
      <div className="jumbotron">
        <div className="container">
          <div className="col-sm-offset-2">
            <Switch>
              <React.Fragment>
              <Route exact path="/" component={ homePage } />
              </React.Fragment>
            </Switch>
          </div>
        </div>
      </div>
    );
  }
}

export default App;