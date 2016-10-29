import React, {Component} from 'react';
import AdminDealsBodyG from './admin_deals_body_g';
import {Profile} from '../../../../imports/collections/profile';
import {Pages} from '../../../../imports/collections/pages';
import {DandE} from '../../../../imports/collections/dande';
import {createContainer} from 'meteor/react-meteor-data';
import {browserHistory} from 'react-router';

class AdminDealsMainG extends Component {
	general(){
		var str = window.location.pathname;
		if(str.includes('gold') || str.includes('general') || str.includes('silver')){
			str = str.substring(0, str.lastIndexOf('/deal')+6);
		}
	    
	    if(str.lastIndexOf('/') == str.length-1){
	    	str = str.slice(0,str.length-1)
	    }
	    var newPath = str + "/"
		browserHistory.push(newPath)
	}
	silver(){
		var str = window.location.pathname;
		if(str.includes('gold') || str.includes('general') || str.includes('silver')){
			str = str.substring(0, str.lastIndexOf('/deal')+6);
		}
	    if(str.lastIndexOf('/') == str.length-1){
	    	str = str.slice(0,str.length-1)
	    }
	    var newPath = str + "-silver/"
		browserHistory.push(newPath)
	}
	gold(){
		var str = window.location.pathname;
		if(str.includes('gold') || str.includes('general') || str.includes('silver')){
			str = str.substring(0, str.lastIndexOf('/deal')+6);
		}
	    if(str.lastIndexOf('/') == str.length-1){
	    	str = str.slice(0,str.length-1)
	    }
	    var newPath = str + "-gold/"
		browserHistory.push(newPath)
	}
    render() {
        return (
        	<div>
        		<div className="container-fluid bg-3 text-center">
        			<div className="col-md-10 col-md-offset-1">
		                <button className="btn btn-primary third-length card-1" onClick={this.general.bind(this)}><h4>General</h4></button>
		                <button className="btn btn-primary third-length card-1" onClick={this.silver.bind(this)}><h4>Silver</h4></button>
		                <button className="btn btn-primary third-length card-1" onClick={this.gold.bind(this)}><h4>Gold</h4></button>
	                </div>
	                <div className="col-md-12">
	                	<AdminDealsBodyG orgGoldDeals={this.props.orgGoldDeals}/>
	                </div>
	            </div> 
        	</div>
        );
    }
}

export default createContainer((props)=>{
	const theId = Meteor.userId();
    var pageID = props.params.pageId
    console.log(pageID)
	Meteor.subscribe('profile');
    Meteor.subscribe('pages');
    Meteor.subscribe('orgGoldDeals')

    return {profile: Profile.findOne(), pages: Pages.findOne({_id: pageID}),
 	 orgGoldDeals: DandE.find({forPage: pageID}).fetch()}

	
}, AdminDealsMainG);