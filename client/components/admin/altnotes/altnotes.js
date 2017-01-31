import React, {Component} from 'react';
import SelectNav from '../select/select_nav';
import SelectFooter from '../select/select_footer';
import AltNotesBody from './altnotes_body';
import {createContainer} from 'meteor/react-meteor-data';
import {Notification} from '../../../../imports/collections/notification';

class AltNotes extends Component {
    render() {
    	if(!this.props.notifications){
    		return<div></div>
    	}
        return (
        	<div>
        		<SelectNav />
		            <div className="container-fluid bg-3 text-center">
		            	<AltNotesBody notes={this.props.notifications} />
		            </div>
            	<SelectFooter />
            </div>
        );
    }
}

export default createContainer((props)=>{
    const theId = Meteor.userId();

    Meteor.subscribe('pages');
    Meteor.subscribe('altnotes');
    return {notifications: Notification.find({}).fetch()}

  
}, AltNotes); 