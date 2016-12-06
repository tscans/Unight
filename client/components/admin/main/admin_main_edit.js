import React, {Component} from 'react';
import ImageUpload from './image_upload';
import {Link, browserHistory} from 'react-router';

class AdminMainEdit extends Component {
	constructor(props){
		super(props);
		this.state = {
			checker: this.props.pages.hasDeals,
			savedClass: "btn btn-primary card-1 top-bot-not",
			savedWords: "Save Changes",
			invis: "transparent",
			done: "Changes Saved",
			counter: 0
		}
	}
	check(){
		this.setState({checker: !this.state.checker})
	}
	editPageData(event){
		event.preventDefault();
		if(this.state.counter == 0){
			var name = this.refs.busname.value.trim();
	        var address = this.refs.busaddress.value.trim();
	        var zip = this.refs.buszip.value.trim();
	        var about = this.refs.busabout.value.trim();
	        var checkb = this.state.checker;
	        var str = window.location.pathname;
		    var res = str.substring(7, str.length - 1);
		    console.log(res)
		    var pageID = res;
	        var geocoder = new google.maps.Geocoder();
	        geocoder.geocode({address: address.toString() }, function(results, status) {

	            if (status == google.maps.GeocoderStatus.OK) {
	            	var loc = []
	             	var longlat = results[0].geometry.location;
	             	console.log(longlat)
	             	loc[0]=results[0].geometry.location.lat();
        			loc[1]=results[0].geometry.location.lng();
	             	Meteor.call('pages.updateGeo', pageID, loc, (error, data) => {
	             		if(error){
	             			console.log('there was an error');
	             			console.log(error)
	             		}
	             		else{
	             			console.log('completed successfully.')
	             		}
	             	})
	            }
	        });
			Meteor.call('pages.updatePage', pageID, name, address, zip, about, checkb, (error, data) => {
				if(error){
	        		console.log("There was an error");
	        		console.log(error);
	            }
	            else{
	            	console.log('completed without error')
	            	this.setState({savedClass: "btn btn-success top-bot-not", savedWords: "Changes Saved", invis: "saved-green"})
	            	this.setState({counter: 1})
	            }
			});
		}
		else{
			console.log('already saved')
			
		}
		
	}
	back(){
		console.log('hi')
	}
    render() {
        return (
        	<div className="card-3 white-back">
        		<form onSubmit={this.editPageData.bind(this)}>
    			<div className="lower"></div>
	    			<div className="col-md-10 col-md-offset-1">
					  <div className="form-group">
					    <label htmlFor="exampleInputEmail1">Name</label>
					    <input type="text" className="form-control foc-card" ref="busname" defaultValue={this.props.pages.orgName} placeholder="Organization Name"/>
					  </div>
					  <div className="form-group">
					    <label htmlFor="exampleInputEmail1">Address</label>
					    <input type="text" className="form-control foc-card" ref="busaddress" defaultValue={this.props.pages.phyAddress} placeholder="Mail Address"/>
					  </div>
					  <div className="form-group">
					    <label htmlFor="exampleInputEmail1">Zip Code</label>
					    <input type="text" className="form-control foc-card" ref="buszip" defaultValue={this.props.pages.zipCode} placeholder="Zip Code"/>
					  </div>
					  <div className="form-group">
					    <label htmlFor="exampleInputEmail1">About Us</label>
					    <textarea rows="4" className="form-control foc-card" ref="busabout" defaultValue={this.props.pages.aboutUs} placeholder="About Us"/>
					  </div>
					  <div className="form-group">
					    <label htmlFor="exampleInputEmail1">Do you want to offer membership deals?</label>
					    <input type="checkbox" className="form-control" checked={this.state.checker} onClick={this.check.bind(this)} />
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
 