import React, {Component} from 'react';
import {Link, browserHistory} from 'react-router';
var zipcodes = require('zipcodes');

class OrgSignup extends Component {
    constructor(props){
        super(props);
        this.state = {
            gif: "invisible"
        }
    }
	register(event){
        event.preventDefault();
        document.getElementById('subButton').disabled = 'disabled';
        this.setState({gif: ""});
        var ema = this.refs.email.value.trim();
        var pss1 = this.refs.password.value.trim();
        var pss2 = this.refs.password2.value.trim();
        var name = this.refs.name.value.trim();
        var zip = this.refs.zip.value.trim();
        if(ema == "" || pss1 == "" || pss2 == "" || name == "" || zip == ""){
            Bert.alert( "Please complete all fields!", 'warning', 'fixed-top' );
            console.log("enter data");
            this.setState({gif: "invisible"});
        }
        else if(pss1 != pss2){
            Bert.alert( "Passwords don't match!", 'warning', 'fixed-top' );
        	console.log('mismatch passwords');
            this.setState({gif: "invisible"});
        }
        
        else{
            var zippy = zipcodes.lookup(zip);
            if(!zippy){
                Bert.alert( "Please use a real zip code.", 'warning', 'fixed-top' );
            }
            Accounts.createUser({
                email: ema,
                password: pss1
            },(error)=>{
                if(error){
                    Bert.alert( error.reason, 'danger', 'fixed-top' );
                    console.log(error);
                }
            });

            Meteor.loginWithPassword(ema, pss1);
            Meteor.call('profile.makeUser', name,zip, (error, data)=> {
            	if(error){
                    Bert.alert( error.reason, 'danger', 'fixed-top' );
            		console.log("There was an error");
            		console.log(error);
                    this.setState({gif: "invisible"});
                    Meteor.logout();
            	}
            	else{
            		console.log(data)
            		
            		this.refs.email.value = "";
                    this.refs.password.value = "";
                    this.refs.password2.value = "";
                    this.refs.name.value = "";
                    this.refs.zip.value = "";
                    this.setState({gif: "invisible"});
                    Bert.alert( 'Way to sign up! Please check your email for confirmation!', 'info', 'fixed-top' );
                    browserHistory.push('/login')
            	}
            	
            })
	        
        }

    }

    render() {
        return (
        	<div>
        		<div className="container-fluid bg-1 text-center">
				  <h2 className="margin">Unight Sign Up</h2>
				  <form className="col-xs-6 col-xs-offset-3 card-3 white-back" onSubmit={this.register.bind(this)}>
        			<div className="lower"></div>
					  <div className="form-group">
					    <label htmlFor="exampleInputEmail1">Email address</label>
					    <input type="email" className="form-control foc-card" ref="email" id="exampleInputEmail1" placeholder="Email"/>
					  </div>
					  <div className="form-group">
					    <label htmlFor="exampleInputEmail1">Your Name</label>
					    <input type="text" className="form-control foc-card" ref="name" placeholder="Name"/>
					  </div>
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Zip Code</label>
                        <input type="text" className="form-control foc-card" ref="zip" placeholder="Zip Code"/>
                      </div>
					  <div className="form-group">
					    <label htmlFor="exampleInputPassword1">Password</label>
					    <input type="password" className="form-control foc-card" ref="password" id="exampleInputPassword1" placeholder="Password"/>
					  </div>
					  <div className="form-group">
					    <label htmlFor="exampleInputPassword1">Confirm Password</label>
					    <input type="password" className="form-control foc-card" ref="password2" id="exampleInputPassword2" placeholder="Confirm Password"/>
					  </div>
					  <button type="submit" id="subButton" className="btn btn-success card-1 top-bot-not">Sign Up</button>
                      <br/>
                      <img src="http://i.imgur.com/TwejQKK.gif" height="35px" className={this.state.gif} />
					</form>
				</div>
        	</div>
        );
    }
}


export default OrgSignup;









