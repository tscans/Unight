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
		
		return this.props.notifications.reverse().map((n)=>{
			var color;
			if(n.type == "DD" || n.type == "GD"){
				color = "wgot-list-beacon-bar";
			}
			if(n.type == "GC"){
				color = "wgot-list-beacon-bar-green";
			}
			if(n.type == "GCD"){
				color = "wgot-list-beacon-bar-red";
			}
			if(n.type == "GM"){
				color = "wgot-list-beacon-bar-purple";
			}
			var point = n._id;
			return(
				<div key={n._id}>
					<div className="card-1 note-cards">
						<div className={color}></div>
						<div className="col-md-1 float-right-alt">
							<button href="#" className="float-right btn btn-danger" onClick={() => {this.removeNote(n._id)}}><span className="glyphicon glyphicon-remove"></span></button>
							<button className="float-right btn btn-warning" onClick={() => {this.runTempModal(n._id, n.createdAt)}}><span className="glyphicon glyphicon-flag"></span></button>
						</div>
						<div className="col-md-3">
							<h3>{moment(n.createdAt.toString()).calendar()}</h3>
						</div>
						<div className="col-md-8 bud-left">
							<h4>{n.message}</h4>
						</div>
					</div>
				</div>
			)
		})
	}
	runTempModal(nid, time){
		var txt;
		time = moment(time.toString()).calendar();
		var r = prompt("Are you sure you want to flag this deal accepted "+time+"? (type 'yes' to confirm.)");
		r = r.toLowerCase()
		if (r == "yes") {
			Meteor.call('notification.deleteNotification',nid,(error,data)=>{
				if(error){
					console.log(error);
				}
				else{
					console.log(data);
					this.forceUpdate();
					alert("The deal has been flagged. The user has not received credit for it and you have not been charged.");
				}
			});
		} else {
		    null;
		}
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
	render(){
		return(
			<div>
				<h1>Livelook Notifications</h1>
				<div>
					{this.renderCards()}
				</div>
			</div>
		)
	}
}

export default AdminLivelookBody;