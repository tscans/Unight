import React, {Component} from 'react';
import {Link, browserHistory} from 'react-router';
import {createContainer} from 'meteor/react-meteor-data';
import {Pages} from '../../../../imports/collections/pages';
import {Profile} from '../../../../imports/collections/profile';
import MemMainList from './mem_main_list';

class MemMainBody extends Component {
    checkVerified(){
        if(!this.props.profile.liveProfile){
            Bert.alert("Your account is not verified. Please check your email to verify.", 'warning', 'growl-bottom-right' );
        }
    }
    render() {
        if(!this.props.profile || !this.props.allPages){
            return<div></div>
        }
        this.checkVerified();
        return (
        	<div className="container-fluid bg-3 text-center">
        		<div>
                    <div className="col-md-6 col-md-offset-6">
				        <MemMainList allPages={this.props.allPages} profile={this.props.profile} />
                    </div>
				</div>
        	</div>
        );
    }
}

export default createContainer((props)=>{
    
    Meteor.subscribe('allPages');
    Meteor.subscribe('profile');
    Meteor.subscribe('favPages');
    return {allPages: Pages.find({}).fetch(), profile: Profile.findOne({})}
	
}, MemMainBody);  

//<div className="form-group map-search">
   // <input type="text" className="form-control foc-card" ref="zipcode" placeholder="Zip Code"/>
    //<button type="submit" className="btn btn-primary card-1 top-bot-not map-search-save">Search</button>
   // </div>