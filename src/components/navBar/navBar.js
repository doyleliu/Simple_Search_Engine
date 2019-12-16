import React, {Component}  from 'react';
import { Button,Navbar, Nav,NavItem,NavDropdown,MenuItem } from 'react-bootstrap';
import { Container } from 'react';

class MenavBar extends React.Component {
    render() {
        return(
        <div>
            <link rel="stylesheet" href="https://bootswatch.com/4/lumen/bootstrap.css" media="screen"></link>
            <link rel="stylesheet" href="https://bootswatch.com/_assets/css/custom.min.css"></link>
              
            <div className="navbar navbar-expand-lg fixed-top navbar-light bg-light">

            <div className="container">
                <a href="/" className="navbar-brand">Home Page</a>

                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation"></button>
            </div>
            </div>
    
        </div>
            
        )}
}

export default MenavBar;