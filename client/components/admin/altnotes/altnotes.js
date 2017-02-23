import React, {Component} from 'react';
import SelectNav from '../select/select_nav';
import SelectFooter from '../select/select_footer';
import AltNotesBody from './altnotes_body';
import {createContainer} from 'meteor/react-meteor-data';
import {Notification} from '../../../../imports/collections/notification';
import {Pages} from '../../../../imports/collections/pages';

class AltNotes extends Component {
    render() {
    	if(!this.props.notifications || !this.props.anp){
    		return<div></div>
    	}
        return (
        	<div>
        		<SelectNav />
		            <div className="container-fluid bg-3 text-center">
		            	<AltNotesBody notes={this.props.notifications} anp={this.props.anp}/>
		            </div>
            	<SelectFooter />
            </div>
        );
    }
}

export default createContainer((props)=>{
    const theId = Meteor.userId();
    Meteor.subscribe('altnotesPage')
    Meteor.subscribe('altnotes');
    return {notifications: Notification.find({}).fetch(), anp: Pages.findOne({})}

  
}, AltNotes); 