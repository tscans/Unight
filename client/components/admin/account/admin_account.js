import React from 'react';
import SelectNav from '../select/select_nav';

class AdminAccount extends React.Component {
	resetPass(e){
		e.preventDefault();
		var oldp = this.refs.oldp.value;
		var newp = this.refs.newp.value;
		var conp = this.refs.conp.value;
		if(newp != conp || oldp == "" || conp == ""){
			console.log("Unmatched Passwords")
			return;
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
	deleteAccount(e){
		e.preventDefault();
		var delp = this.refs.delpass.value;
		Meteor.call('profile.deleteUser', delp, (error,data)=>{
			if(error){
				console.log(error);
			}
			else{
				console.log(data, "success");
			}
		})
	}
	render(){
		return (
			<div>
				<SelectNav />
				<br/>
				<br/>
				<div className="container-fluid bg-3 text-center">
					<form className="card-3 white-back col-md-6 col-md-offset-3" onSubmit={this.resetPass.bind(this)}>
	                <div className="lower"></div>
	                <h2>Reset Password</h2>
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
				<div className="col-md-6 col-md-offset-3">
					<button type="button" className="btn btn-danger btn-lg btn-extend card-1" data-toggle="modal" data-target="#myModal">Delete Account</button>
				</div>
				<div className="modal fade all-black" id="myModal" role="dialog">
				    <div className="modal-dialog">
				      <div className="modal-content">
				        <div className="modal-header">
				          <button type="button" className="close" data-dismiss="modal">&times;</button>
				          <h4 className="modal-title">Delete Account</h4>
				        </div>
				        <div className="modal-body">
				          <p>If you are sure you want to permenantly delete your account, simply type in your password below.</p>
				          <label htmlFor="exampleInputEmail1">Confirm Password</label>
	                      <input type="password" className="form-control foc-card" ref="delpass" placeholder="Confirm Password"/>
				        </div>
				        <div className="modal-footer">
				          <button type="button" onClick={this.deleteAccount.bind(this)} className="btn btn-danger" data-dismiss="modal">Delete</button>
				          <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
				        </div>
				      </div>
				    </div>
				</div>
			</div>
		)
	}
}

export default AdminAccount;