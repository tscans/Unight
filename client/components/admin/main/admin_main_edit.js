import React, {Component} from 'react';

class AdminMainEdit extends Component {
	editPageData(event){
		event.preventDefault();
		var name = this.refs.busname.value.trim();
        var address = this.refs.busaddress.value.trim();
        var pic = this.refs.buspic.value.trim();
        var zip = this.refs.buszip.value.trim();
        var about = this.refs.busabout.value.trim();
        var page = this.props.pages;
        
		Meteor.call('pages.updatePage', page, name, address, pic, zip, about, (error, data) => {
			if(error){
        		console.log("There was an error");
        		console.log(error);
            }
            else{
            	console.log('completed without error')
            }
		});
	}
    render() {
        return (
        	<div>
        		<form className="card-3 white-back" onSubmit={this.editPageData.bind(this)}>
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
				    <label htmlFor="exampleInputEmail1">Picture Link</label>
				    <input type="text" className="form-control foc-card" ref="buspic" defaultValue={this.props.pages.proPict} placeholder="Picture Link"/>
				  </div>
				  <div className="form-group">
				    <label htmlFor="exampleInputEmail1">Zip Code</label>
				    <input type="text" className="form-control foc-card" ref="buszip" defaultValue={this.props.pages.zipCode} placeholder="Zip Code"/>
				  </div>
				  <div className="form-group">
				    <label htmlFor="exampleInputEmail1">About Us</label>
				    <textarea rows="4" className="form-control foc-card" ref="busabout" defaultValue={this.props.pages.aboutUs} placeholder="About Us"/>
				  </div>
				  </div>
				  <button type="submit" className="btn btn-primary card-1 top-bot-not"><span className="glyphicon glyphicon-ok"></span> Save Changes</button>
				</form>

        	</div>
        );
    }
}

export default AdminMainEdit;
