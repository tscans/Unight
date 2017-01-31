import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Profile} from '../../../../imports/collections/profile';
import {Pages} from '../../../../imports/collections/pages';
import AdminGiftBody from './admin_gift_body';

class AdminGiftMain extends React.Component {
	checkEvents(){
      if(!this.props.pages.hasGiftCards){
        var warn = "Warning! Your page does not currently allow gift cards. In order to reverse this go to the Home page."
        setTimeout(()=>{Bert.alert( warn, 'warning', 'fixed-top' )},1000)
      }
    }
	render(){
		if(!this.props.pages){
			return<div><img src="http://i.imgur.com/TwejQKK.gif" height="100px" /></div>
		}
    	{this.checkEvents()}
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