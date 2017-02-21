import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import NotesList from './notes_list';
import {Notification} from '../../../../imports/collections/notification';

class MemNotes extends Component{
	render(){
		if(!this.props.notifications){
			return(
				<div>
				...Loading
				</div>
			)
		}
		return(
			<div>
				<div className="container-fluid bg-3 text-center bump-push-bar">
	        		<div className="col-md-6 col-md-offset-6">
	        			<h2>Notifications</h2>
	        			<NotesList notes={this.props.notifications}/>
	        		</div>
	        	</div>
			</div>
		)
	}
}
export default createContainer((props)=>{
    const theId = Meteor.userId();

    Meteor.subscribe('memnotes');
    return {notifications: Notification.find({}).fetch()}

  
}, MemNotes); 