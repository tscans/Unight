import React, {Component} from 'react';
import {Link} from 'react-router';
import {createContainer} from 'meteor/react-meteor-data';
import {UProfile} from '../../../../imports/collections/uprofile';
import {Pages} from '../../../../imports/collections/pages';
import MemMainList from './mem_main_list';
import MemMainLeft from './mem_main_left';

class MemMainBody extends Component {
    render() {
        return (
        	<div className="container-fluid bg-3 text-center">
                <div className="col-md-3">
                    <MemMainLeft uprofile={this.props.uprofile}/>
                </div>
        		<div className="col-md-9">
				    <MemMainList allPages={this.props.allPages}/>
				</div>
        	</div>
        );
    }
}

export default createContainer((props)=>{
	Meteor.subscribe('uprofile');
    Meteor.subscribe('allPages');

    return {uprofile: UProfile.findOne(), allPages: Pages.find({})}

	
}, MemMainBody);  