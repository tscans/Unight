import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Profile} from '../../../../imports/collections/profile';
import {Pages} from '../../../../imports/collections/pages';
import AdminEventsBody from './admin_events_body';
import {DandE} from '../../../../imports/collections/dande';

class AdminEventsMain extends React.Component {
    render() {
        return (
        	<div>
        		<div className="container-fluid bg-3 text-center">
	                <AdminEventsBody events={this.props.events} />
	            </div> 
        	</div>
        );
    }
}

export default createContainer((props)=>{
	const theId = Meteor.userId();
    
    var pageID = props.params.pageId;
	Meteor.subscribe('profile');
    Meteor.subscribe('pages');
    Meteor.subscribe('events');

    return {profile: Profile.findOne(), pages: Pages.findOne({_id: pageID}),
     events: DandE.find({forPage: pageID}).fetch()}

	
}, AdminEventsMain); 