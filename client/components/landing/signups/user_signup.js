import React, {Component} from 'react';
import {Link, browserHistory} from 'react-router';

class UserSignup extends Component {
    constructor(props){
        super(props);
        this.state = {
            gif: "invisible"
        }
    }
	register(event){
        event.preventDefault();
        this.setState({gif: ""});
        var ema = this.refs.email.value.trim();
        var pss1 = this.refs.password.value.trim();
        var pss2 = this.refs.password2.value.trim();
        var name = this.refs.fullname.value.trim();

        if(ema == "" || pss1 == "" || pss2 == "" || name == ""){
            console.log("enter data");
        }
        else if(pss1 != pss2){
        	console.log('mismatch passwords');
        }
        else{
            Meteor.call('profile.makeUser', ema, pss1, (error, data)=> {
            	if(error){
            		console.log("There was an error");
            		console.log(error);
            	}
            	else{
            		console.log(data)
            		Meteor.loginWithPassword(ema, pss1);
            		var usid = data.toString();
					
            		Meteor.call('profile.insertData', name, usid, (error, data) => {
            			if(error){
            				console.log("There was an error");
            				console.log(error);
            			}
            			else{
		            		this.refs.email.value = "";
					        this.refs.password.value = "";
					        this.refs.password2.value = "";
					        this.refs.fullname.value = "";
                            this.setState({gif: "invisible"})
					        browserHistory.push('/user/')
            			}
            		})
            		
            	}
            	
            })
	        
        }

    }
    render() {
        return (
        	<div>
        		<div className="container-fluid bg-1 text-center">
				  <h2 className="margin">Sign Up As a User</h2>
				  <form className="col-xs-8 col-xs-offset-2 card-3 white-back" onSubmit={this.register.bind(this)}>
        			<div className="lower"></div>
					  <div className="form-group">
					    <label htmlFor="exampleInputEmail1">Email address</label>
					    <input type="email" className="form-control foc-card" ref="email" id="exampleInputEmail1" placeholder="Email"/>
					  </div>
					  <div className="form-group">
					    <label htmlFor="exampleInputName">Full Name</label>
					    <input type="text" className="form-control foc-card" ref="fullname" id="exampleInputEmail1" placeholder="Full Name"/>
					  </div>
					  <div className="form-group">
					    <label htmlFor="exampleInputPassword1">Password</label>
					    <input type="password" className="form-control foc-card" ref="password" id="exampleInputPassword1" placeholder="Password"/>
					  </div>
					  <div className="form-group">
					    <label htmlFor="exampleInputPassword1">Confirm Password</label>
					    <input type="password" className="form-control foc-card" ref="password2" id="exampleInputPassword2" placeholder="Password"/>
					  </div>
					  <button type="submit" className="btn btn-primary card-1 top-bot-not">Sign Up</button>
					  <div className="higher"></div>
					</form>
				</div>
        	</div>
        );
    }
}

export default UserSignup;
 