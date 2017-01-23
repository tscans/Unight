import React, {Component} from 'react';
import {Link, browserHistory} from 'react-router';
import {createContainer} from 'meteor/react-meteor-data';
import {Profile} from '../../../../imports/collections/profile';
import SelectNav from '../select/select_nav';

class AdminSelectMain extends Component {
	checkCleared(){
		if(!this.props.profile.businessVerified){
			setTimeout(()=>{
				$('#warningModal').modal('show');
			}, 2000);	
		}
	}
	renderModal(){
        return(
          <div>
            <div className="modal fade all-black" id="warningModal" role="dialog">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                    <h4 className="modal-title">Enter Data</h4>
                  </div>
                  <div className="modal-body">
                    Your business account is not verified. Please fill out the following fields to become eligible for creating organization pages.
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-default" data-dismiss="modal">OK</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
    }
    createAccount(){
    	Meteor.call('stripe.makeAccount',(error,data)=>{
    		if(error){
    			console.log(error);
    		}
    		else{
    			console.log(data);
    		}
    	})
    }
	render(){
		if(!this.props.profile){
			return<div></div>
		}
		this.checkCleared();
		return(
			<div>
				<SelectNav />
				<div className="bump-body">
					<div className="container-fluid bg-3 text-center">
						{this.renderModal()}
						<h1>sub</h1>
						<button className="btn btn-default card-1" onClick={this.createAccount.bind(this)}>Create Account</button>
					</div>
				</div>
			</div>
		)
	}
}

export default createContainer((props)=>{
	const theId = Meteor.userId();
	Meteor.subscribe('profile');

	return {profile: Profile.findOne()}

	
}, AdminSelectMain); 
 