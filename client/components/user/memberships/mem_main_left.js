import React, {Component} from 'react';

class MemMainLeft extends Component {
    zipcode(event){
		event.preventDefault();
		var zipcode = this.refs.zipcode.value.trim();
        var profile = this.props.uprofile
        console.log(profile)
		Meteor.call('uprofile.updateData', profile, zipcode, (error, data) => {
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
    	if(!this.props.uprofile){
    		return(<div>loading</div>)
    	}
        return (
        	<div>
        		<form className="card-3 white-back" onSubmit={this.zipcode.bind(this)}>
    			<div className="lower"></div>
    			<div className="col-md-10 col-md-offset-1">
				  <div className="form-group">
				    <label htmlFor="exampleInputEmail1">Zip Code</label>
				    <input type="text" className="form-control foc-card" ref="zipcode" defaultValue={this.props.uprofile.zipCode} placeholder="Zip Code"/>
				  </div>
				  </div>
				  <button type="submit" className="btn btn-primary card-1 top-bot-not"><span className="glyphicon glyphicon-ok"></span> Save Changes</button>
				</form>
        	</div>
        );
    }
}

export default MemMainLeft;
