import React, {Component} from 'react';
import AdminDealsBody from './admin_deals_body';
import {browserHistory} from 'react-router';
import {createContainer} from 'meteor/react-meteor-data';
import {Profile} from '../../../../imports/collections/profile';
import {Pages} from '../../../../imports/collections/pages';
import {DandE} from '../../../../imports/collections/dande';

class AdminDealsMain extends Component {
	general(){
		var str = window.location.pathname;
		if(str.includes('gold') || str.includes('general')){
			str = str.substring(0, str.lastIndexOf('/deal')+6);
		}
	    
	    if(str.lastIndexOf('/') == str.length-1){
	    	str = str.slice(0,str.length-1)
	    }
	    var newPath = str + "/"
		browserHistory.push(newPath)
	}
	gold(){
		var str = window.location.pathname;
		if(str.includes('gold') || str.includes('general')){
			str = str.substring(0, str.lastIndexOf('/deal')+6);
		}
	    if(str.lastIndexOf('/') == str.length-1){
	    	str = str.slice(0,str.length-1)
	    }
	    var newPath = str + "-gold/"
		browserHistory.push(newPath)
	}
	checkDeals(){
		if(!this.props.pages.hasDeals){
			var warn = "Warning! Your page does not currently allow deals. In order to reverse this go to the Home page."
			setTimeout(()=>{alert(warn)},1000)
		}
	}
    render() {
    	if(!this.props.pages){
    		return<div></div>
    	}
    	{this.checkDeals()}
        return (
        	<div>
        		<div className="container-fluid bg-3 text-center">
	        		<div className="col-md-10 col-md-offset-1">
		                <button className="btn btn-primary third-length card-1" onClick={this.general.bind(this)}><h4>General</h4></button>
		                <button className="btn btn-primary third-length card-1" onClick={this.gold.bind(this)}><h4>Gold</h4></button>
	                </div>
	                <div className="col-md-12">
	                	<AdminDealsBody orgGeneralDeals={this.props.orgGeneralDeals}/>
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
    Meteor.subscribe('orgGeneralDeals')

    return {profile: Profile.findOne(), pages: Pages.findOne({_id: pageID}),
     orgGeneralDeals: DandE.find({forPage: pageID}).fetch()
     }

	
}, AdminDealsMain); 
