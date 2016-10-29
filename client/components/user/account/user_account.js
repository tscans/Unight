import React from 'react';

class UserAccount extends React.Component {
	resetPass(e){
		e.preventDefault();
		var oldp = this.refs.oldp.value;
		var newp = this.refs.newp.value;
		var conp = this.refs.conp.value;
		if(newp != conp){
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

	render(){
		return (
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
		)
	}
}

export default UserAccount;