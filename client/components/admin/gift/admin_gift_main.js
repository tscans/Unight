import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Profile} from '../../../../imports/collections/profile';
import {Pages} from '../../../../imports/collections/pages';
import AdminGiftBody from './admin_gift_body';

class AdminGiftMain extends React.Component {
	render(){
		if(!this.props.pages){
			return<div><img src="http://i.imgur.com/TwejQKK.gif" height="100px" /></div>
		}
		console.log(this.props.pages)
		return(
			<div>
				<div className="container-fluid bg-3 text-center">
	                <AdminGiftBody par={this.props.params} pages={this.props.pages} pageId={this.props.params.pageId}/>
	            </div>
			</div>
		)
	}
}

export default createContainer((props)=>{
	const theId = Meteor.userId();
    
    var pageID = props.params.pageId;
	Meteor.subscribe('profile');
    Meteor.subscribe('pages');

    return {profile: Profile.findOne({}), pages: Pages.findOne({_id: pageID})}

	
}, AdminGiftMain); 