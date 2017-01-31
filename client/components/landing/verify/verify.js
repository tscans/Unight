import React, {Component} from 'react';
import {Link, browserHistory} from 'react-router';
import {createContainer} from 'meteor/react-meteor-data';

class Verify extends Component {
    verify(){

        console.log(this.props.IDS)
        var block = this.props.IDS;
        if(block.call=="email"){
            Meteor.call('profile.unSubEmail', block.userID, block.code,(error,data)=>{
                if (error){
                    console.log(error)
                    Bert.alert( error.message, 'danger', 'fixed-top' );
                }
                else{
                    console.log('verified')
                    Bert.alert( 'You will no longer be on our email list.', 'info', 'fixed-top' );
                    browserHistory.push('/'+block.pref)
                }
            })
        }
        if(block.call=="ver"){
            Meteor.call('profile.verifyUser', block.userID, block.code,(error,data)=>{
                if (error){
                    console.log(error)
                    Bert.alert( error.message, 'danger', 'fixed-top' );
                }
                else{
                    console.log('verified')
                    Bert.alert( 'Great! You are confirmed on Unight!', 'success', 'fixed-top' );
                    browserHistory.push('/'+block.pref)
                }
            })
        }
        
    }
    render() {
        if(!this.props.IDS){
            return<div></div>
        }
        this.verify();
        return (
        	<div>
        		<div className="container-fluid bg-3 text-center">
				  <h2 className="margin">Unight Verification</h2>
				  <div className="top-bot-not"></div>
                  <p className="top-bot-not">Sit tight for one second while we verify!</p>
                  <img src="http://i.imgur.com/TwejQKK.gif" height="100px" />
				</div>
        	</div>
        );
    }
}


export default createContainer((props)=>{
    var par = props.params
    return {IDS: par}

  
}, Verify); 









