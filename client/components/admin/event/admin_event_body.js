import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Profile} from '../../../../imports/collections/profile';
import {Pages} from '../../../../imports/collections/pages';
import {DandE} from '../../../../imports/collections/dande';
import AdminEventInfo from './admin_event_info';
import {Link} from 'react-router';

class AdminEventBody extends React.Component {
    render() {
        console.log(this.props.events)
    	if(!this.props.events){
    		return <div></div>
    	}
    	
	    var pageID = this.props.pid;
        var helper = '/admin/'+pageID+'/events/';
        return (
        	<div>
        		<div className="col-md-1">
        			<div className="arrow-align">
	                    <h1><Link to={helper}><span className="glyphicon glyphicon-arrow-left card-sup"></span></Link></h1>
	                </div>	
        		</div>
        		<AdminEventInfo event={this.props.events} page={this.props}/>
        	</div>
        );
    }
}

export default createContainer((props)=>{
	const theId = Meteor.userId();

    var bo = props.info.params.pageId
	Meteor.subscribe('profile');
    Meteor.subscribe('pages');
    Meteor.subscribe('events');

    return {profile: Profile.findOne(), pages: Pages.findOne({_id: bo[0]}),
     events: DandE.findOne({_id: bo[1]}), pid: bo[0]}

	
}, AdminEventBody); 