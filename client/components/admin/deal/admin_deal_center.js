import React from 'react';
import ImageUpload from './image_upload';
import {browserHistory} from 'react-router';
var DatePicker = require("react-bootstrap-date-picker");

class AdminDealCenter extends React.Component {	
	constructor(props) {
		super(props);
		this.state = {
			dateTime: "",
			error: false
		}
	}
	editPageData(event){
		event.preventDefault();
		var title = this.refs.title.value;
        var desc = this.refs.desc.value;
        var str = window.location.pathname;
	    var res = str.substring(7, str.lastIndexOf('/deal'));
	    var pageID = res;

        var str = window.location.pathname;
	    var res = str.substring(str.lastIndexOf('/deal')+7, str.length - 1);
	    var dealID = res;
	    var expi = this.state.dateTime;
	    var maxn = 2;
	    var cost = false;
        var isError;
		Meteor.call('dande.updateDandE', pageID, dealID, title, desc, expi, maxn, cost,(error, data) => {
			if(error){
        		console.log("There was an error");
        		console.log(error);
        		Bert.alert(error.message, 'warning', 'fixed-top' );
        		this.setState({error: true});
            }
            else{
            	console.log('completed without error');
            	this.setState({error: false});
            	document.getElementById('subButton').disabled = false;
            }
		});
		
	}
	
	publish(event){
		event.preventDefault();
		console.log('pub')
		var str = window.location.pathname;
	    var res = str.substring(7, str.lastIndexOf('/deal'));
	    var pageID = res;

        var str = window.location.pathname;
	    var res = str.substring(str.lastIndexOf('/deal')+7, str.length - 1);
	    var dealID = res;
		Meteor.call('dande.publishDandE', pageID, dealID, (error, data) => {
			if(error){
        		console.log("There was an error");
        		console.log(error);
        		Bert.alert(error.message, 'warning', 'fixed-top' );
            }
            else{
            	console.log('completed without error');
            	var str = window.location.pathname;
			    var res = str.substring(0, str.lastIndexOf('/deal')+7);
			    var pageID = res;
            	browserHistory.push(pageID);
            }
		});
	}
	randomize(){
		var str = window.location.pathname;
	    var res = str.substring(str.lastIndexOf('/deal')+7, str.length - 1);
	    var dealID = res;
		Meteor.call('dande.randomIC', dealID, (error,data)=>{
			if(error){
				console.log(error);

			}
			else{
				console.log(data);
			}
		})
	}
	handleDate(value){
		console.log('go')
		this.setState({dateTime: value});
	}
    render() {
    	if(!this.props.deals){
    		return <div></div>
    	}
        return (
        	<div>
	        	<div className="col-md-6">
	        		<form className="card-3 white-back" onSubmit={this.publish.bind(this)}>
	    			<div className="lower"></div>
		    			<div className="col-md-10 col-md-offset-1">
						  <div className="form-group">
						    <label htmlFor="exampleInputEmail1">Deal Title</label>
						    <input type="text" className="form-control foc-card" ref="title" defaultValue={this.props.deals.title} placeholder="Deal Title"/>
						  </div>
						  <div className="form-group">
						    <label htmlFor="exampleInputEmail1">Description</label>
						    <input type="text" className="form-control foc-card" ref="desc" defaultValue={this.props.deals.description} placeholder="Deal Description"/>
						  </div>
						  <div className="form-group">
						    <label htmlFor="exampleInputEmail1">Day This Deal is for</label>
						    <DatePicker id="example-datepicker" value={this.state.dateTime} onChange={this.handleDate.bind(this)} />
						  </div>
						  <div className="form-group">
						    <label htmlFor="exampleInputEmail1">Deal Picture <i>(image upload/save occurs immediately)</i></label>
						    <div className="center-div">
						    	<ImageUpload />
						    </div>
						  </div>
					  </div>
					  <button onClick={this.editPageData.bind(this)} className="btn btn-default card-1 top-bot-not"><span className="glyphicon glyphicon-pencil"></span> Save and View</button>
					  <br/>
					  <button id="subButton" disabled className="btn btn-primary card-1 top-bot-not"><span className="glyphicon glyphicon-ok"></span> Save and Publish</button>
					</form>

				</div>
				<div className="col-md-6">
					<div className="card-3 white-back">
						<img className="prime-img-head" src={this.props.deals.image}/>
						<div>
							<h3>Title: {this.props.deals.title}</h3>
							<p>Description: {this.props.deals.description}</p>
							<p>Only Good For: {this.props.deals.startDate}</p>
							<p>Random Coupon Icon</p>
							<div className="top-bot-not">
								<i className={"fa "+this.props.deals.randomIcon+" icon-large "+ " ic-"+this.props.deals.randomColor}></i>
							</div>
						</div>
					</div>
					<p>Don't like the icon?</p>
					<button className="btn btn-default card-2" onClick={this.randomize.bind(this)}>Randomize</button>
				</div>
        	</div>
        );
    }
}

export default AdminDealCenter;
