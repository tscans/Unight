import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Profile} from '../../../../imports/collections/profile';
import LoginOrg from './login_org';
import {Link, browserHistory} from 'react-router';

class Login extends Component {
    asUser(){
        if(Meteor.userId()){
            browserHistory.push('/user/')
        }
        else{
            browserHistory.push('/loginuser')
        }
    }
    asAdmin(){
        if(Meteor.userId()){
            browserHistory.push('/admin-select/')
        }
        else{
            browserHistory.push('/loginorg')
        }
    }
    render() {
        return (
        	<div>
        		<div className="container-fluid bg-1 text-center body-push-bar">
				  <h1 className="margin card-sup"><a onClick={this.asUser.bind(this)} href="#">LOGIN AS USER</a></h1>
				</div>
				<div className="container-fluid bg-3 text-center">
				  <h1 className="margin card-sup"><a onClick={this.asAdmin.bind(this)} href="#">LOGIN AS ORGANIZATION</a></h1>
				</div>
        	</div>
        );
    }
}

export default Login;






