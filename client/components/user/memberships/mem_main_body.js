import React, {Component} from 'react';
import {Link, browserHistory} from 'react-router';
import {createContainer} from 'meteor/react-meteor-data';
import {Pages} from '../../../../imports/collections/pages';
import MemMainList from './mem_main_list';

class MemMainBody extends Component {
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
                console.log('completed without error');
                this.forceUpdate();
                console.log(zipcode)
                browserHistory.push(`/user/memberships/${zipcode}/`)

            }
        });
    }
    render() {
        return (
        	<div className="container-fluid bg-3 text-center">
        		<div>
                <div className="col-md-4">
                    <form className="card-3 white-back" onSubmit={this.zipcode.bind(this)}>
                    <div className="lower"></div>
                    <div className="col-md-10 col-md-offset-1">
                      <div className="form-group">
                        <label htmlFor="exampleInputEmail1">Zip Code</label>
                        <input type="text" className="form-control foc-card" ref="zipcode" placeholder="Zip Code"/>
                      </div>
                      </div>
                      <button type="submit" className="btn btn-primary card-1 top-bot-not"><span className="glyphicon glyphicon-ok"></span> Save Changes</button>
                    </form>
                </div>
                    <div className="col-md-8">
				        <MemMainList/>
                    </div>
				</div>
        	</div>
        );
    }
}

export default createContainer((props)=>{
    return {noob: 4}

	
}, MemMainBody);  