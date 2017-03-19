import React from 'react';
import ImageUploadG from './image_upload_g';
import {browserHistory} from 'react-router';

class AdminDealCenterG extends React.Component {
	editPageData(event){
		event.preventDefault();
		var title = this.refs.title.value;
        var desc = this.refs.desc.value;
        var expi = this.refs.expi.value;
        var maxn = this.refs.maxn.value;
        var cost = this.refs.cost.value;

        var str = window.location.pathname;
	    var res = str.substring(7, str.lastIndexOf('/deal'));
	    var pageID = res;

        var str = window.location.pathname;
	    var res = str.substring(str.lastIndexOf('/deal')+12, str.length - 1);
	    var dealID = res;
	    cost = parseInt(cost);
	    expi = parseInt(expi);
	    console.log(expi);
	    maxn = parseInt(maxn);
        
		Meteor.call('dande.updateDandE', pageID, dealID, title, desc, expi, maxn, cost, (error, data) => {
			if(error){
        		console.log("There was an error");
        		console.log(error);
            }
            else{
            	console.log('completed without error');
            	document.getElementById('subButton').disabled = false;
            }
		});
	}
	publish(event){
		event.preventDefault();
	    var pageID = this.props.params.pageId[0];

	    var dealID = this.props.params.pageId[1];
	    console.log(pageID,dealID)
		Meteor.call('dande.publishDandE', pageID, dealID, (error, data) => {
			if(error){
        		console.log("There was an error");
        		console.log(error);
            }
            else{
            	console.log('completed without error');
            	browserHistory.push("/admin/"+pageID+"/deals-gold/");
            }
		});
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
						    <label htmlFor="exampleInputEmail1">Deal Cost $</label>
						    <input type="string" className="form-control foc-card" ref="cost" defaultValue={this.props.deals.cost} placeholder="$ amount user will pay"/>
						  </div>
						  <div className="form-group">
						    <label htmlFor="exampleInputEmail1">Days to Last (1-90) #</label>
						    <input type="number" className="form-control foc-card" ref="expi" placeholder="# of Days the Deal Will be Available"/>
						  </div>
						  <div className="form-group">
						    <label htmlFor="exampleInputEmail1">Max Number of Users #</label>
						    <input type="number" className="form-control foc-card" ref="maxn" defaultValue={this.props.deals.maxn} placeholder="Maximum Number of Users to Accept the Deal"/>
						  </div>
						  <div className="form-group">
						    <label htmlFor="exampleInputEmail1">Deal Picture <i>(image upload/save occurs immediately)</i></label>
						    <div className="center-div">
						    	<ImageUploadG />
						    </div>
						  </div>
					  </div>
					  <div onClick={this.editPageData.bind(this)} className="btn btn-default card-1 top-bot-not"><span className="glyphicon glyphicon-ok"></span> Save and View</div>
					  <br/>
					  <button id="subButton" disabled type="submit" className="btn btn-primary card-1 top-bot-not"><span className="glyphicon glyphicon-ok"></span> Save and Publish</button>
					  <br/>
					  
					</form>
	        	</div>
	        	<div className="col-md-6">
					<div className="card-3 white-back">
						<img className="prime-img-head" src={this.props.deals.image}/>
						<div>
							<h3>Title: {this.props.deals.title}</h3>
							<p>Description: {this.props.deals.description}</p>
							<p>Starts: {this.props.deals.startDate} - Expires: {this.props.deals.expiration}</p>
							<p>Maximum Coupons Available: {this.props.deals.maxn.toString()}</p>
							<p>Cost: ${this.props.deals.cost.toFixed(2).toString()}</p>
						</div>
					</div>
				</div>
        	</div>
        );
    }
}

export default AdminDealCenterG;
