import { Meteor } from 'meteor/meteor';
import { Profile } from '../imports/collections/profile';
import { Pages } from '../imports/collections/pages';
import {UProfile} from '../imports/collections/uprofile';

Meteor.startup(() => {
	Meteor.publish('profile', function(){
		return Profile.find({ ownerId: this.userId });
	});
	Meteor.publish('uprofile', function(){
		return UProfile.find({ ownerId: this.userId });
	});
	Meteor.publish('pages', function(){
		var user = this.userId.toString();
		if(!user){
			return;
		}
		
		return Pages.find({
			ownedBy: {$elemMatch: {$eq: user}}
		})
	});
	Meteor.publish('allPages', function(){
		var user = this.userId.toString();
		var allb = UProfile.find({ownerId: user}).fetch()
		var zip = allb[0].zipCode
		if(!user){
			return;
		}
		return Pages.find({
			zipCode: zip
		})
	});
	
});
