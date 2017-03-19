import React, {Component} from 'react';
import ImageUpload from './image_upload';
import {Link, browserHistory} from 'react-router';

class AdminMainEdit extends Component {
	constructor(props){
		super(props);
		var ad = "btn btn-danger card-1 top-bot-not";
		var am = "btn btn-danger card-1 top-bot-not";
		var ae = "btn btn-danger card-1 top-bot-not";
		var ag = "btn btn-danger card-1 top-bot-not";
		var d = "No Deals";
		var m = "No Memberships";
		var e = "No Events";
		var g = "No Gift Cards"
		if(this.props.pages.hasDeals){
			ad = "btn btn-success card-1 top-bot-not";
			d = "Allow Deals";
		}
		if(this.props.pages.hasMembers){
			am = "btn btn-success card-1 top-bot-not"
			m = "Allow Memberships";
		}
		if(this.props.pages.hasEvents){
			ae = "btn btn-success card-1 top-bot-not";
			e = "Allow Events";
		}
		if(this.props.pages.hasGiftCards){
			ag = "btn btn-success card-1 top-bot-not";
			g = "Allow Gift Cards";
		}
		console.log(ad)
		this.state = {
			savedClass: "btn btn-primary card-1 top-bot-not",
			savedWords: "Save Changes",
			invis: "transparent",
			done: "Changes Saved",
			allowDeals: ad,
			allowMemberships: am,
			allowEvents: ae,
			allowGiftCards: ag,
			deals: d,
			memberships: m,
			events: e,
			giftCards: g
		}
	}
	editPageData(event){
		event.preventDefault();

			var name = this.refs.busname.value.trim();
	        var address = this.refs.busaddress.value.trim();
	        var zip = this.refs.buszip.value.trim();
	        var about = this.refs.busabout.value.trim();
	        var website = this.refs.website.value.trim();
	        var str = window.location.pathname;
		    var res = str.substring(7, str.length - 1);
		    console.log(res)
		    var pageID = res;
	        var geocoder = new google.maps.Geocoder();
	        if(address.toString() == this.props.pages.phyAddress){
	        	0
	        }else{
	        	geocoder.geocode({address: address.toString() }, function(results, status) {
	        	console.log('geo commencing')
	            if (status == google.maps.GeocoderStatus.OK) {
	            	var loc = []
	             	var longlat = results[0].geometry.location;
	             	console.log(longlat)
	             	loc[0]=results[0].geometry.location.lat();
        			loc[1]=results[0].geometry.location.lng();
        			console.log('geo commencing')
	             	Meteor.call('pages.updateGeo', pageID, loc, (error, data) => {
	             		if(error){
	             			console.log('there was an error');
	             			console.log(error)
	             		}
	             		else{
	             			console.log('New Geo Complete.')
	             		}
	             	})
	            }
	            else{
	            	console.log(status)
	            }
	        });
	        }
	        
	        var hasDeals = false;
	        var hasMembers = false;
	        var hasEvents = false;
	        var hasGiftCards = false;
	        if(this.state.deals.includes("Allow")){

				hasDeals = true;
			}
			if(this.state.memberships.includes("Allow")){
				hasMembers = true;
			}
	        if(this.state.events.includes("Allow")){
				hasEvents = true;
			}
			if(this.state.giftCards.includes("Allow")){
				hasGiftCards = true;
			}
			if(pageID == "" || name == "" || address == "" || zip == ""){
				Bert.alert("Organization needs all fields completed.", 'danger', 'fixed-top' );
				return;
			}
			Meteor.call('pages.updatePage', pageID, name, address, zip, website, about, hasDeals, hasMembers, hasEvents, hasGiftCards, (error, data) => {
				if(error){
	        		console.log("There was an error");
	        		console.log(error);
	        		Bert.alert(error.message, 'danger', 'fixed-top' );
	            }
	            else{
	            	console.log('completed without error')
	            	Bert.alert( 'Changes Saved!', 'success', 'fixed-top' );
	            	this.setState({savedClass: "btn btn-success top-bot-not", savedWords: "Changes Saved", invis: "saved-green"})
	            	setTimeout(()=>{this.setState({savedClass: "btn btn-primary card-1 top-bot-not", savedWords: "Save Changes", invis: "transparent"})},2500)
	            }
			});
		
	}
	back(){
		console.log('hi')
	}
	onDeals(){
		if(this.state.deals.includes("Allow")){
			this.setState({allowDeals: "btn btn-danger card-1 top-bot-not"});
			this.setState({deals: "No Deals"});
		}
		else{
			this.setState({allowDeals: "btn btn-success card-1 top-bot-not"});
			this.setState({deals: "Allow Deals"});
		}
	}
	onMemberships(){
		if(this.state.memberships.includes("Allow")){
			this.setState({allowMemberships: "btn btn-danger card-1 top-bot-not"});
			this.setState({memberships: "No Memberships"});
		}
		else{
			this.setState({allowMemberships: "btn btn-success card-1 top-bot-not"});
			this.setState({memberships: "Allow Memberships"});
		}
	}
	onEvents(){
		if(this.state.events.includes("Allow")){
			this.setState({allowEvents: "btn btn-danger card-1 top-bot-not"});
			this.setState({events: "No Events"});
		}
		else{
			this.setState({allowEvents: "btn btn-success card-1 top-bot-not"});
			this.setState({events: "Allow Events"});
		}
	}
	onGiftCards(){
		if(this.state.giftCards.includes("Allow")){
			this.setState({allowGiftCards: "btn btn-danger card-1 top-bot-not"});
			this.setState({giftCards: "No Gift Cards"});
		}
		else{
			this.setState({allowGiftCards: "btn btn-success card-1 top-bot-not"});
			this.setState({giftCards: "Allow Gift Cards"});
		}
	}
    render() {
    	if(!this.props.pages){
    		return<div></div>
    	}
        return (
        	<div className="card-3 white-back">
        		<form onSubmit={this.editPageData.bind(this)}>
    			<div className="lower"></div>
	    			<div className="col-md-10 col-md-offset-1">
	    			<br/>
					  <div className="form-group">
					    <label htmlFor="exampleInputEmail1">Name</label>
					    <input type="text" className="form-control foc-card" ref="busname" defaultValue={this.props.pages.orgName} placeholder="Organization Name" maxLength="25"/>
					  </div>
					  <div className="form-group">
					    <label htmlFor="exampleInputEmail1">Address</label>
					    <input type="text" className="form-control foc-card" ref="busaddress" defaultValue={this.props.pages.phyAddress} placeholder="Mail Address" maxLength="80"/>
					  </div>
					  <div className="form-group">
					    <label htmlFor="exampleInputEmail1">Zip Code</label>
					    <input type="text" className="form-control foc-card" ref="buszip" defaultValue={this.props.pages.zipCode} placeholder="Zip Code" maxLength="5"/>
					  </div>
					  <div className="form-group">
					    <label htmlFor="exampleInputEmail1">Website</label>
					    <input type="text" className="form-control foc-card" ref="website" defaultValue={this.props.pages.website} placeholder="Website" maxLength="80"/>
					  </div>
					  <div className="form-group">
					    <label htmlFor="exampleInputEmail1">About Us</label>
					    <textarea rows="4" className="form-control foc-card" ref="busabout" defaultValue={this.props.pages.aboutUs} placeholder="About Us" maxLength="250"/>
					  </div>
				  </div>
				  <div className="form-group">
				    <label htmlFor="exampleInputEmail1">Deal Picture <i>(image upload/save occurs immediately)</i></label>
				    <div className="center-div">
				    	<ImageUpload />
				    </div>
				  </div>
				  <div className={this.state.invis}>
				  	<p>{this.state.done}</p>
				  </div>
				  <button type="submit" className={this.state.savedClass}><span className="glyphicon glyphicon-ok"></span> {this.state.savedWords}</button>
				</form>
        	</div>
        );
    }
}

export default AdminMainEdit;
 