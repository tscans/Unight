import { Meteor } from 'meteor/meteor';
import { Profile } from '../imports/collections/profile';
import { Pages } from '../imports/collections/pages';
import {DandE} from '../imports/collections/dande';
import {TomBook} from '../imports/collections/tombook';
import {GiftCards} from '../imports/collections/giftcards';
import {Notification} from '../imports/collections/notification';
import moment from 'moment';

Meteor.startup(() => {
	var stripe = StripeAPI(Meteor.settings.StripePri);
	var buff = function(){
		console.log('LOL BUFF ACTIVATED')
	}
	Meteor.setTimeout(buff, 5000)
	var runDailyExpiCheck = false;
	console.log('lolwhatever')

	Meteor.setInterval(function() {
		if(!runDailyExpiCheck){
			console.log("checking now");
		    var d = new Date();
			var n = d.getMinutes();
			var newExpi = moment(d).add(5,'days').format("ll"); 
			var allDandEs = DandE.find({expiration: newExpi}).fetch();
			for(var i =0;i<allDandEs.length;i++){
				console.log(allDandEs[i]._id)
				DandE.update(allDandEs[i]._id, {$set:{dealsOn: false}})
				var message = "Your deal - '"+allDandEs[i].title+"' - has reached its expiration date and expired.";
				Notification.insert({
					ownerId: allDandEs[i].topUser,
					pageOwner: allDandEs[i].forPage,
					message: message,
					type: "DD",
					createdAt: new Date(),
				});
			}
			console.log(allDandEs.length)
			runDailyExpiCheck = true
		}
	    

	}, 10000);

	//6 hours times 60 minutes times 60 seconds times 1000 = 21,600,000

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

		return DandE.find({dealsOn: true}, { limit: per_page, sort: {upvotes: -1}})
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
	Meteor.publish('pageDeals', function(pageID){
		var user = this.userId.toString();
		if(!user){
			return;
		}
		return DandE.find({forPage: pageID, dealsOn: true})
	});
	Meteor.publish('userCards', function(){
		var user = this.userId.toString();
		if(!user){
			return;
		}
		return GiftCards.find({ownerId: user})
	});
	Meteor.publish('adminCards', function(pageID){
		var user = this.userId.toString();
		if(!user){
			return;
		}
		var page = Pages.findOne({_id: pageID});
		if(page.ownedBy[0] != user){
			return;
		}
		return GiftCards.find({pageID: pageID})
	});
	Meteor.publish('notifications', function(){
		var user = this.userId.toString();
		if(!user){
			return;
		}

		return Notification.find({ownerId: user});
	});
});
