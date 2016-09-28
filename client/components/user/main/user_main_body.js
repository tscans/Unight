import React, {Component} from 'react';
import {Link} from 'react-router';
import {createContainer} from 'meteor/react-meteor-data';
import {UProfile} from '../../../../imports/collections/uprofile';
import {Pages} from '../../../../imports/collections/pages';

class UserMainBody extends Component {
    render() {
        return (
        	<div className="container-fluid bg-3 text-center">
                <Link to="/user/memberships">To Mem area</Link>
        	</div>
        );
    }
}

export default createContainer((props)=>{
	Meteor.subscribe('uprofile');
    Meteor.subscribe('allPages');

    return {uprofile: UProfile.findOne(), allPages: Pages.find({})}

	
}, UserMainBody);  