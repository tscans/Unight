import React from 'react';
import {Link, browserHistory} from 'react-router';

class LoginUser extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            gif: "invisible"
        }
    }
	login(event){
		event.preventDefault();
        this.setState({gif: ""});
		var ema = this.refs.signemail.value.trim();
        var pss1 = this.refs.signpass.value.trim();
		Meteor.loginWithPassword(ema, pss1, (error, data) => {
			if(error){
                Bert.alert( 'User/Password does not match.', 'danger', 'fixed-top' );
        		console.log("There was an error");
                this.setState({gif: "invisible"});
        		console.log(error);
            }
            else{
            	this.refs.signemail.value = "";
		        this.refs.signpass.value = "";
                this.setState({gif: "invisible"})
		        browserHistory.push('/user/')
            }
		});
	}
    render() {
        return (
        	<div>
        		<div className="container-fluid bg-1 text-center">
        		<div className="arrow-align">
                    <h1><Link to={'/login'}><span className="glyphicon glyphicon-arrow-left card-sup"></span></Link></h1>
                </div>
                  <h2 className="margin">LOGIN USER</h2>
                  <form className="col-xs-6 col-xs-offset-3 card-3 white-back" onSubmit={this.login.bind(this)}>
        			<div className="lower"></div>
					  <div className="form-group black-text">
					    <label htmlFor="exampleInputEmail1">Email address</label>
					    <input type="email" className="form-control foc-card" ref="signemail" id="exampleInputEmail1" placeholder="Email"/>
					  </div>
					  <div className="form-group black-text">
					    <label htmlFor="exampleInputPassword1">Password</label>
					    <input type="password" className="form-control foc-card" ref="signpass" id="exampleInputPassword1" placeholder="Password"/>
					  </div>
					  <button type="submit" className="btn btn-primary card-1 top-bot-not">Login</button>
                      <br/>
                      <img src="http://i.imgur.com/TwejQKK.gif" height="35px" className={this.state.gif} />
					</form>
                </div>
        	</div>
        );
    }
}

export default LoginUser;
