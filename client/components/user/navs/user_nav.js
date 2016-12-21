import React, {Component} from 'react';
import {Link, browserHistory} from 'react-router';

class UserNav extends Component {
    logout(event){
        event.preventDefault();
        Meteor.logout();
        browserHistory.push('/');
    }
    account(event){
      event.preventDefault();
      browserHistory.push('/user/account');
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
                  <Link className="navbar-brand card-sup pos-up img-responsive hover-off" to='/user/'><img src="http://i.imgur.com/urR5bHp.jpg" width="100" height="100"/></Link>
                </div>
                <div className="collapse navbar-collapse">
                  <ul className="nav navbar-nav navbar-right">
                    <li><Link to="/user/"><span className="glyphicon glyphicon-usd"></span>TOMBOOK</Link></li>
                    <li><Link to="/user/wgot"><span className="glyphicon glyphicon-calendar"></span>TONIGHT</Link></li>
                    <li><Link to="/user/memberships"><span className="glyphicon glyphicon-globe"></span>MEMBERSHIPS</Link></li>
                    <li className="dropdown">
                      <a href="#" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true" aria-expanded="false"><span className="glyphicon glyphicon-cog"></span> ACCOUNT<span className="glyphicon glyphicon-triangle-bottom"></span></a>
                      <ul className="dropdown-menu">
                        <li><a href="#"><span className="glyphicon glyphicon-asterisk"></span> Help</a></li>
                        <li><a href="#" onClick={this.account.bind(this)}><span className="glyphicon glyphicon-user"></span> Account</a></li>
                        <li role="separator" className="divider"></li>
                        <li><a href="#" onClick={this.logout.bind(this)}><span className="glyphicon glyphicon-off"></span>Logout</a></li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
        );
    }
}

export default UserNav;