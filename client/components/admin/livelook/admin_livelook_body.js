import React from 'react';
import moment from 'moment';

class AdminLivelookBody extends React.Component{
	renderCards(){
		if(this.props.notifications.length == 0){
			return(
				<div>
					<h3>You have no notifications.</h3>
				</div>
			)
		}
		var notes = this.props.notifications.reverse();
		return notes.map((n)=>{
			var numDeals = 0;
			var numGiftCard = 0;
			var numBuyers = 0;
			var numMembers = 0;
			var color;
			if(n.type == "DD" || n.type == "GD"){
				color = "wgot-list-beacon-bar";
				numDeals = numDeals + 1;
			}
			if(n.type == "GC"){
				color = "wgot-list-beacon-bar-green";
				numGiftCard = numGiftCard + 1;
			}
			if(n.type == "GCD"){
				color = "wgot-list-beacon-bar-red";
				numBuyers = numBuyers + 1;
			}
			if(n.type == "GM"){
				color = "wgot-list-beacon-bar-purple";
				numMembers = numMembers + 1;
			}
			var point = n._id;
			return(
				<div key={n._id}>
					<div className="card-1 note-cards">
						<div className={color}></div>
						{this.renderChoice(n)}
						<div className="col-md-3">
							<h4>{moment(n.createdAt.toString()).calendar()}</h4>
						</div>
						<div className="col-md-7 bud-left">
							<h4>{n.message}</h4>
						</div>
					</div>
				</div>
			)
		})
	}
	renderChoice(n){
		if(n.type=="DD" || n.type == "GD"){
			return(
				<div>
					<div className="col-md-1 float-left-alt">
						<button className="float-left btn btn-danger" onClick={() => {this.removeNote(n._id)}}><span className="glyphicon glyphicon-remove"></span></button>
					</div>
					<div className="col-md-1 float-right-alt">
						<button className="float-right btn btn-success" onClick={() => {this.runTempModal(n._id, n.createdAt)}}><span className="glyphicon glyphicon-ok"></span></button>
					</div>
				</div>
			)
		}
		else{
			return(
				<div>
					<div className="col-md-1 float-left-alt">
						<button className="float-left btn btn-danger" onClick={() => {this.removeNote(n._id)}}><span className="glyphicon glyphicon-remove"></span></button>
					</div>
				</div>
			)
		}
	}
	runTempModal(nid){
		Meteor.call('notification.acceptNotification',nid,(error,data)=>{
			if(error){
				console.log(error);
				Bert.alert(error.message, 'danger', 'growl-bottom-right' );
			}
			else{
				console.log(data);
				this.forceUpdate();
				Bert.alert('Deal Accepted', 'success', 'growl-bottom-right' );
			}
		});
	}
	removeNote(nid){
		console.log(nid)
		Meteor.call('notification.deleteNotification',nid,(error,data)=>{
			if(error){
				console.log(error);
			}
			else{
				console.log(data);
				this.forceUpdate();
			}
		})
	}
	sideBarData(){
		if(this.props.notifications.length < 3){
			return<div></div>
		}
		console.log('ran')
		var numDeals = 0;
		var numGiftCard = 0;
		var numBuyers = 0;
		var numMembers = 0;
		this.props.notifications.map((n)=>{
			console.log('ran')
			var color;
			if(n.type == "DD" || n.type == "GD"){
				numDeals = numDeals + 1;
			}
			if(n.type == "GC"){
				numGiftCard = numGiftCard + 1;
			}
			if(n.type == "GCD"){
				numBuyers = numBuyers + 1;
			}
			if(n.type == "GM"){
				numMembers = numMembers + 1;
			}
		})
		console.log('ran')
		return(
			<div>
				<h1>Livelook Notifications ({this.props.notifications.length})</h1>
				<p><b>Number of Deal Notes: </b>{numDeals}</p>
				<p><b>Number of New Memberships Notes: </b>{numMembers}</p>
				<p><b>Number of Gift Card Purchase Notes: </b>{numGiftCard}</p>
				<p><b>Number of Purchases with Gift Card Notes: </b>{numBuyers}</p>
			</div>
		)
	}
	render(){
		return(
			<div>
				<div className="col-md-8">
					<div>
						{this.renderCards()}
					</div>
				</div>
				<div className="col-md-4">
					<div className="freeze card-1">
						{this.sideBarData()}
					</div>
				</div>
			</div>
		)
	}
}

export default AdminLivelookBody;