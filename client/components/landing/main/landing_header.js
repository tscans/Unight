import React, {Component} from 'react';
import {Link, browserHistory} from 'react-router';

class LandingHeader extends Component {
    routeLogin(event){
      event.preventDefault();
      browserHistory.push('/login')
    }
    render() {
        return (
            <nav className="navbar navbar-default navbar-fixed-top card-3">
              <div className="container">
                <div className="navbar-header">
                  <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                  </button>
                  <Link className="navbar-brand card-sup pos-up img-responsive hover-off" to='/'><img src="http://i.imgur.com/urR5bHp.jpg" width="100" height="100"/></Link>
                </div>
                <div className="collapse navbar-collapse">
                  <ul className="nav navbar-nav navbar-right">
                    <li><a href="#" onClick={this.routeLogin.bind(this)}><span className="glyphicon glyphicon-off"></span> LOGIN</a></li>
                  </ul>
                </div>
              </div>
            </nav>
        );
    }
}

export default LandingHeader;