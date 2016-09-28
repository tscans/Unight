import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Profile} from '../../../../imports/collections/profile';
import {Pages} from '../../../../imports/collections/pages';
import AdminSelectMain from './admin_select_main';

class AdminSelectPull extends Component {
    render() {
        return (
        	<div>
        		<AdminSelectMain profile={this.props.profile} pages={this.props.pages} />
        	</div>
        );
    }
}

export default createContainer((props)=>{
	const theId = Meteor.userId();
	Meteor.subscribe('profile');
	Meteor.subscribe('pages');

	return {profile: Profile.findOne(), pages: Pages.find({})}

	
}, AdminSelectPull); 
 