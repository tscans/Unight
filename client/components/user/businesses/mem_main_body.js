import React, {Component} from 'react';
import {Link, browserHistory} from 'react-router';
import {createContainer} from 'meteor/react-meteor-data';
import {Pages} from '../../../../imports/collections/pages';
import {Profile} from '../../../../imports/collections/profile';
import MemMainList from './mem_main_list';

class MemMainBody extends Component {
    zipcode(event){
        event.preventDefault();
        var zipcode = this.refs.zipcode.value.trim();
        Meteor.subscribe('allPages', zipcode);
        Meteor.call('profile.updateZip', zipcode, (error, data) => {
            if(error){
                console.log("There was an error");
                console.log(error);
            }
            else{
                console.log('completed without error');
                this.forceUpdate();
            }
        });
    }
    checkVerified(){
        if(!this.props.profile.liveProfile){
            Bert.alert("Your account is not verified. Please check your email to verify.", 'warning', 'fixed-top' );
        }
    }
    render() {
        if(!this.props.profile){
            return<div></div>
        }
        this.checkVerified();
        return (
        	<div className="container-fluid bg-3 text-center">
        		<div>
                <div className="col-md-4 col-md-offset-2">
                    <form onSubmit={this.zipcode.bind(this)}>
                    <div className="lower"></div>
                    <div className="col-md-10 col-md-offset-1">
                      
                    </div>
                    </form>
                </div>
                    <div className="col-md-6">
				        <MemMainList allPages={this.props.allPages} />
                    </div>
				</div>
        	</div>
        );
    }
}

export default createContainer((props)=>{
    
    Meteor.subscribe('allPages');
    Meteor.subscribe('profile');
    return {allPages: Pages.find({}).fetch(), profile: Profile.findOne({})}
	
}, MemMainBody);  

//<div className="form-group map-search">
   // <input type="text" className="form-control foc-card" ref="zipcode" placeholder="Zip Code"/>
    //<button type="submit" className="btn btn-primary card-1 top-bot-not map-search-save">Search</button>
   // </div>