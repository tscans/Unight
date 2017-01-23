import React from 'react';
import {Profile} from '../../../../imports/collections/profile';
import {createContainer} from 'meteor/react-meteor-data';

class UserAccount extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			showFriends: false
		}
	}
	resetPass(e){
		e.preventDefault();
		var oldp = this.refs.oldp.value;
		var newp = this.refs.newp.value;
		var conp = this.refs.conp.value;
		if(newp != conp){
			console.log("Unmatched Passwords")
			return;
		}
		if(newp ==""){
			return
		}
		Accounts.changePassword(oldp, newp, (error, data)=>{
			if(error){
				console.log(error)
			}
			else{
				console.log(data)
				console.log('worked')
			}
		})
	}
	showFriends(){
		this.setState({showFriends: !this.state.showFriends});
	}
	listFriends(){
		if(this.state.showFriends){
			if(this.props.profile.friendUsers.lenth == 0){
				return<div>You have no friends saved.</div>
			}
			else{
				return this.props.profile.friendUsers.map(f=>{
					return(
						<div key={f.name}>
							<a className="float-right btn btn-danger" href="#" onClick={() => {this.removeFriend(f)}}><span className="glyphicon glyphicon-remove"></span></a>
							<p>{f.name} -- {f.number}</p>
						</div>
					)
				})
			}
		}
		else{
			return(
				<div></div>
			)
		}
	}
	removeFriend(f){
		Meteor.call('profile.removeFriend', f.number, (error,data)=>{
			if(error){
				console.log(error);
			}
			else{
				console.log(data);
			}
		})
	}
	addFriend(){
		var number = this.refs.phone.value.trim();
		var name = this.refs.name.value.trim();
		Meteor.call('profile.addFriend', number,name, (error,data)=>{
			if(error){
				console.log(error);
			}
			else{
				console.log(data);
			}
		})
	}
	render(){
		if(!this.props.profile){
			return<div></div>
		}
		return (
			<div className="container-fluid bg-3 text-center">
				<div className="col-md-8 col-md-offset-2">
					<div className="card-3 white-back col-md-10 col-md-offset-1">
	                <div className="lower"></div>
	                <h3>Add Friends</h3>
	                <div className="col-md-10 col-md-offset-1">
	                  <div className="form-group">
	                    <label>Friend's Email</label>
	                    <input type="text" className="form-control foc-card" ref="phone" placeholder="Email Address"/>
	                  </div>
	                  <div className="form-group">
	                    <label>Friend's Name</label>
	                    <input type="text" className="form-control foc-card" ref="name" placeholder="Friend's Name"/>
	                  </div>
	                  </div>
	                  <button onClick={this.addFriend.bind(this)} className="btn btn-primary card-1 top-bot-not">Add Friend</button>
	                </div>
	                <div className="card-3 white-back col-md-10 col-md-offset-1">
	                	<button onClick={this.showFriends.bind(this)} className="btn btn-default card-1 top-bot-not">Show Friends</button>
	                	{this.listFriends()}
	                </div>

					<form className="card-3 white-back col-md-10 col-md-offset-1" onSubmit={this.resetPass.bind(this)}>
	                <div className="lower"></div>
	                <h3>Reset Password</h3>
	                <div className="col-md-10 col-md-offset-1">
	                  <div className="form-group">
	                    <label htmlFor="exampleInputEmail1">Old Password</label>
	                    <input type="password" className="form-control foc-card" ref="oldp" placeholder="Old Password"/>
	                    <label htmlFor="exampleInputEmail1">New Password</label>
	                    <input type="password" className="form-control foc-card" ref="newp" placeholder="New Password"/>
	                    <label htmlFor="exampleInputEmail1">Confirm Password</label>
	                    <input type="password" className="form-control foc-card" ref="conp" placeholder="Confirm Password"/>
	                  </div>
	                  </div>
	                  <button type="submit" className="btn btn-success card-1 top-bot-not">Change Password</button>
	                </form>
                </div>
			</div>
		)
	}
}

export default createContainer((props)=>{
	console.log(props.pageID)
    Meteor.subscribe('profile');

    return {profile: Profile.findOne({})}

	
}, UserAccount); 



