import React from 'react';
import ImageUpload from './image_upload';
import {browserHistory} from 'react-router';
import DatePicker from "react-bootstrap-date-picker";

class AdminEventInfo extends React.Component {
	constructor(props){
		super(props);
		var value = new Date().toISOString();
		this.state = {
			pubWords: "Private",
			title: "",
			date: "",
			desc: "",
			address: "",
			value: value
		}
	}
	deleteEvent(){
		var eventID = this.props.page.info.params.pageId[1];
		var pageID = this.props.page.info.params.pageId[0]
		Meteor.call('dande.removeDandE', eventID, (error, data)=>{
			if(error){
				console.log(error)
			}
			else{
				console.log('removed successfully')
				browserHistory.push("/admin/"+pageID+"/events/")
			}
		})
	}
	submitForm(event){
		event.preventDefault();
		var str = window.location.pathname;
	    var res = str.substring(7, str.lastIndexOf('/event'));
	    console.log('yo')
	    if(str.lastIndexOf('/') == str.length - 1){
	    	var pos = str.substring(str.lastIndexOf('/event') + 8, str.length - 1)
	    }
	    else{
	    	var pos = str.substring(str.lastIndexOf('/event') + 8, str.length)
	    }
	    console.log(pos)
	    var pageID = res;
	    var eventID = pos;
	    var title = this.refs.title.value.trim();
	    var dateTime = this.state.value;
	    var description = this.refs.desc.value.trim();
	    var published;
	    var phyAddress = this.refs.address.value.trim();
	    if (this.state.pubWords == "Private"){
	    	published = false
	    }
	    else{
	    	published = true
	    }
	    console.log(dateTime)
		Meteor.call('dande.updateEvents',pageID, eventID, title, dateTime, description, published, phyAddress, (error, data) => {
            if(error){
                console.log(error)
            }
            else{
                console.log('description updated')
            }
        })
	}
	handleChange(value){
		this.setState({
	      value: value
	    });
	    console.log(value)
	}
	flipPub(){
		if(this.state.pubWords == "Public"){
			this.setState({pubWords: "Private"})
		}
		else{
			this.setState({pubWords: "Public"})
		}
		
	}
	changeDefault(){
		console.log('changed')
		this.refs.title.value = this.props.event.title;
		this.refs.date.value = this.props.event.dateTime;
		this.refs.desc.value = this.props.event.description;
		this.refs.address.value = this.props.event.phyAddress;
	}
    render() {
    	if(!this.props.event){
    		return <div></div>
    	}
    	console.log(this.props.page.info.params.pageId)
        return (
        	<div>
        		<div className="col-md-6">
        			<div className="card-2">
        				<h2>Edit Panel</h2>
        				  <a href="#" onClick={this.changeDefault.bind(this)}>
						  	<div className="card-1 btn btn-success deals-par">
						  		Load Saved Data
						  	</div>
						  </a>
        				<form className="white-back" onSubmit={this.submitForm.bind(this)}>
			    			<div className="lower"></div>
				    			<div className="col-md-10 col-md-offset-1">
								  <div className="form-group">
								    <label htmlFor="exampleInputEmail1">Event Title</label>
								    <input type="text" className="form-control foc-card" ref="title" defaultValue={this.props.event.title} placeholder="Event Title"/>
								  </div>
								  <label htmlFor="exampleInputEmail1">Event Date</label>
								  <div className="form-group foc-card">
								  	<DatePicker ref="date" value={this.state.value} onChange={this.handleChange.bind(this)} />
								  </div>
								  <div className="form-group">
								    <label htmlFor="exampleInputEmail1">Event Description</label>
								    <input type="text" className="form-control foc-card" ref="desc" defaultValue={this.props.event.description} placeholder="Event Description"/>
								  </div>
								  <div className="form-group">
								    <label htmlFor="exampleInputEmail1">Event Address</label>
								    <input type="text" className="form-control foc-card" ref="address" defaultValue={this.props.event.phyAddress} placeholder="Event Description"/>
								  </div>
								  	<label>Make This Event Seen by Users (public)</label>
								  	<br/>
								  <a href="#" onClick={this.flipPub.bind(this)}>
								  	<div className="card-1 btn btn-success deals-par">
								  		{this.state.pubWords}
								  	</div>
								  </a>
							  </div>
							  <div className="form-group">
							    <label htmlFor="exampleInputEmail1">Deal Picture <i>(image upload/save occurs immediately)</i></label>
							    <div className="center-div">
							    	<ImageUpload page={this.props.page}/>
							    </div>
							  </div>
							  <button type="submit" className="btn btn-primary card-1 top-bot-not"><span className="glyphicon glyphicon-ok"></span> Save Changes</button>
						</form>
        			</div>
        			<br />
        			<div className="btn btn-danger card-1 btn-extend" onClick={this.deleteEvent.bind(this)}><h4>Delete Event</h4></div>
        		</div>
        		<div className="col-md-5">
        			<div className="card-2">
        				<img src={this.props.event.image} width="100%" height="200px" className="surround" />
        				<div className="left-text-w-bump">
        					<h2>{this.props.event.title}</h2>
        					<b>People Attending</b>
        					<p>{this.props.event.numAttending}</p>
        					<b>Date and Time</b>
        					<p>{this.props.event.dateTime}</p>
        					<b>Description</b>
        					<p>{this.props.event.description.slice(0,118) + '...'}</p>
        				</div>
        			</div>
        		</div>
        	</div>
        );
    }
}

export default AdminEventInfo;
