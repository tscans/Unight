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
			Bert.alert("Unmatched Passwords", 'danger', 'fixed-top' );
			return;
		}
		if(newp ==""){
			return
		}
		Accounts.changePassword(oldp, newp, (error, data)=>{
			if(error){
				Bert.alert(error.message, 'danger', 'fixed-top' );
				this.refs.oldp.value = "";
				this.refs.newp.value = "";
				this.refs.conp.value = "";
				console.log(error)
			}
			else{
				console.log(data)
				Bert.alert("Password Changed.", 'success', 'fixed-top' );
				this.refs.oldp.value = "";
				this.refs.newp.value = "";
				this.refs.conp.value = "";
				console.log('worked')
			}
		})
	}
	showFriends(){
		this.setState({showFriends: !this.state.showFriends});
	}
	listFriends(){
		if(this.state.showFriends){
			if(this.props.profile.friendUsers.length == 0){
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
				Bert.alert(error.message, 'danger', 'fixed-top' );
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
				Bert.alert(error.message, 'danger', 'fixed-top' );
				this.refs.phone.value = "";
				this.refs.name.value = "";
				console.log(error);
			}
			else{
				Bert.alert("Friend Added", 'default', 'fixed-top' );
				this.refs.phone.value = "";
				this.refs.name.value = "";
				console.log(data);
			}
		})
	}
	deAccount(e){
		e.preventDefault();
		var delp = this.refs.delpass.value.trim();
		if(delp!="confirm"){
			console.log(delp)
			console.log('not confirmed')
			return;
		}
		Meteor.call('profile.deactivateUser', delp, (error,data)=>{
			if(error){
				Bert.alert(error.message, 'danger', 'fixed-top' );
				console.log(error);
			}
			else{
				console.log(data, "success");
			}
		})
	}
	aAccount(e){
		e.preventDefault();
		var delp = this.refs.delpass2.value.trim();
		if(delp!="confirm"){
			console.log('not confirmed')
			return;
		}
		Meteor.call('profile.activateUser', delp, (error,data)=>{
			if(error){
				Bert.alert(error.message, 'danger', 'fixed-top' );
				console.log(error);
			}
			else{
				console.log(data, "success");
			}
		})
	}
	activate(){
		if(this.props.profile.deactivate){
			return(
				<div className=" col-md-10 col-md-offset-1 card-3 white-back">
					<p>To reactivate purchase powers click the button below.</p>
					<button type="button" className="btn btn-success btn-lg btn-extend card-1 top-bot-not" data-toggle="modal" data-target="#myModal2">Reactivate Account</button>
				</div>
			)
		}
		else{
			return(
				<div className=" col-md-10 col-md-offset-1 card-3 white-back">
					<p>For security purposes, we save all user data. However, you do have the ability to prevent expenses from occuring on this account. Simply deactivating your account will stop any charges from happening on this account.</p>
					<button type="button" className="btn btn-danger btn-lg btn-extend card-1 top-bot-not" data-toggle="modal" data-target="#myModal">Deactivate Account</button>
				</div>
			)
		}
	}
	chag(){
		Meteor.call('profile.updateZip', "60643",(error,data)=>{
			if(error){
				Bert.alert(error.message, 'danger', 'fixed-top' );
				console.log(error);
			}
			else{
				console.log(data, "success");
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
	                    <button onClick={this.chag.bind(this)}>svs</button>
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
	                {this.activate()}
                </div>
				<div className="modal fade all-black" id="myModal" role="dialog">
				    <div className="modal-dialog">
				      <div className="modal-content">
				        <div className="modal-header">
				          <button type="button" className="close" data-dismiss="modal">&times;</button>
				          <h4 className="modal-title">Deactivate Account</h4>
				        </div>
				        <div className="modal-body">
				          <p>If you are sure you want to deactivate your account, simply type in "confirm" below.</p>
				          <label htmlFor="exampleInputEmail1">Confirm</label>
	                      <input type="text" className="form-control foc-card" ref="delpass" placeholder="confirm"/>
				        </div>
				        <div className="modal-footer">
				          <button type="button" onClick={this.deAccount.bind(this)} className="btn btn-danger" data-dismiss="modal">Deactivate</button>
				          <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
				        </div>
				      </div>
				    </div>
				</div>
				<div className="modal fade all-black" id="myModal2" role="dialog">
				    <div className="modal-dialog">
				      <div className="modal-content">
				        <div className="modal-header">
				          <button type="button" className="close" data-dismiss="modal">&times;</button>
				          <h4 className="modal-title">Activate Account</h4>
				        </div>
				        <div className="modal-body">
				          <p>If you are sure you want to activate your account, simply type in "confirm" below.</p>
				          <label htmlFor="exampleInputEmail1">Confirm</label>
	                      <input type="text" className="form-control foc-card" ref="delpass2" placeholder="confirm"/>
				        </div>
				        <div className="modal-footer">
				          <button type="button" onClick={this.aAccount.bind(this)} className="btn btn-success" data-dismiss="modal">Activate</button>
				          <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
				        </div>
				      </div>
				    </div>
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



