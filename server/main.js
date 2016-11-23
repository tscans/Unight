import { Meteor } from 'meteor/meteor';
import { Profile } from '../imports/collections/profile';
import { Pages } from '../imports/collections/pages';
import {DandE} from '../imports/collections/dande';
import {TomBook} from '../imports/collections/tombook';

Meteor.startup(() => {
	var dwolla = require('dwolla-v2');
	var DWOLLA_ID = "91b11610-2e5a-48d1-b72c-8f12c370f6d2";
	var DWOLLA_SECRET = "4dO2YZhnxO5gnMlAEggs6zi9j6VaOWq7I1dGrMJTsuUPD03kt8";
	var client = new dwolla.Client({
	  id: DWOLLA_ID,
	  secret: DWOLLA_SECRET,
	  environment: 'sandbox',
	});




	Meteor.publish('profile', function(){
		return Profile.find({ ownerId: this.userId });
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
		console.log(user)
		if(!user){
			return;
		}

		return Pages.find({
		})
	});

	Meteor.publish('memOrgPage', function(){
		var user = this.userId.toString();
		if(!user){
			return;
		}
		
		return Pages.find({})
	});
	Meteor.publish('orgGeneralDeals', function(){
		var user = this.userId.toString();
		if(!user){
			return;
		}
		
		return DandE.find({
			topUser: user,
			typeDE: "DD"
		})
	});
	Meteor.publish('orgSilverDeals', function(){
		var user = this.userId.toString();
		if(!user){
			return;
		}
		
		return DandE.find({
			topUser: user,
			typeDE: "SD"
		})
	});
	Meteor.publish('orgGoldDeals', function(){
		var user = this.userId.toString();
		if(!user){
			return;
		}
		
		return DandE.find({
			topUser: user,
			typeDE: "GD"
		})
	});
	Meteor.publish('events', function(){
		var user = this.userId.toString();
		if(!user){
			return;
		}
		
		return DandE.find({
			topUser: user,
			typeDE: "E"

		})
	});
	Meteor.publish('wgot', function(per_page){
		var user = this.userId.toString();
		if(!user){
			return;
		}
		
		return DandE.find({}, { limit: per_page, sort: {upvotes: -1}})
	});
	Meteor.publish('tombook', function(){
		var user = this.userId.toString();
		if(!user){
			return;
		}
		
		return TomBook.find({
			topUser: user
		})
	});
	Meteor.publish('tblist', function(tbcb){
		var user = this.userId.toString();
		if(!user){
			return;
		}

		return DandE.find({_id: {$in:tbcb}})
		//return [Events.find({_id: {$in:tbce}}),GoldDeals.find({_id: {$in:tbcg}}),SilverDeals.find({_id: {$in:tbcs}}),GeneralDeals.find({_id: {$in:tbcd}})]
	});
	Meteor.publish('tbMember', function(){
		var user = this.userId.toString();
		if(!user){
			return;
		}
		const profile = Profile.findOne({
			ownerId: user
		})

		return Pages.find({_id: {$in: profile.goldMember}})
	});
});
