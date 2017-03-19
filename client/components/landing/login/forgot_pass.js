import React from 'react';
import {Link, browserHistory} from 'react-router';
import { Accounts } from 'meteor/accounts-base';

class ForgotPass extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            gif: "invisible"
        }
    }
	reset(event){
		event.preventDefault();
        this.setState({gif: ""});
		var email = this.refs.signemail.value.trim();

		Meteor.call("profile.resetPass", email, (error, data) => {
			if(error){
                Bert.alert( error.message, 'danger', 'fixed-top' );
        		console.log("There was an error");
                this.setState({gif: "invisible"});
        		console.log(error);
            }
            else{
            	this.refs.signemail.value = "";
                this.setState({gif: "invisible"});
                $('#myModal').modal('toggle');
                Bert.alert( "Check your email.", 'info', 'fixed-top' );
            }
		});
	}
    randomPass(){
        var code = this.refs.code.value.trim();
        Meteor.call("profile.newPass", code, (error,data)=>{
            if(error){
                Bert.alert( error.message, 'danger', 'fixed-top' );
            }
            else{
                $('#myModal').modal('toggle');
                browserHistory.push('/loginuser');
                Bert.alert( "Check your email for your new password.", 'success', 'fixed-top' );
            }
        });
    }
    toggleModal(){
        $('#myModal').modal('toggle');
    }
    codeModal(){
        return(
            <div>
                <div className="modal fade all-black" id="myModal" role="dialog">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                        <h4 className="modal-title">Enter Code</h4>
                      </div>
                      <div className="modal-body">
                        <p>You have been emailed a code to enter here to recover you account. You will then be emailed a temporary password. Please enter this code now.</p>
                        <input type="number" className="form-control foc-card large-input" ref="code" placeholder="######"/>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-primary" onClick={this.randomPass.bind(this)}>Enter Code</button>
                        <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
        )
    }
    render() {
        return (
        	<div>
                {this.codeModal()}
        		<div className="container-fluid bg-1 text-center">
        		<div className="arrow-align">
                    <h1><Link to={'/login'}><span className="glyphicon glyphicon-arrow-left card-sup"></span></Link></h1>
                </div>
                  <h2 className="margin">Forgot Password</h2>

                  <form className="col-xs-6 col-xs-offset-3 card-3 white-back" onSubmit={this.reset.bind(this)}>
                    <a href="#" onClick={this.toggleModal.bind(this)}>Already have a code? Enter it.</a>
        			<div className="lower"></div>
					  <div className="form-group black-text">
                        <p>Enter your email address and we will send you an email to reset and recover your account.</p>
					    <label htmlFor="exampleInputEmail1">Email address</label>
					    <input type="email" className="form-control foc-card" ref="signemail" id="exampleInputEmail1" placeholder="Email"/>
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

export default ForgotPass;
