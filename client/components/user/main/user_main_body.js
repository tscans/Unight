import React, {Component} from 'react';
import {Link} from 'react-router';
import {createContainer} from 'meteor/react-meteor-data';
import {Pages} from '../../../../imports/collections/pages';
import {Profile} from '../../../../imports/collections/profile';
import {TomBook} from '../../../../imports/collections/tombook';

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
    Meteor.subscribe('allPages');
    Meteor.subscribe('profile');
    Meteor.subscribe('tombook');

    return {allPages: Pages.find({}), profile: Profile.find({}), tombook: TomBook.find({})}

	
}, UserMainBody);  