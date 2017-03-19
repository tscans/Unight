import { Meteor } from 'meteor/meteor';
import { Profile } from '../imports/collections/profile';
import { Pages } from '../imports/collections/pages';
import {DandE} from '../imports/collections/dande';
import {TomBook} from '../imports/collections/tombook';
import {GiftCards} from '../imports/collections/giftcards';
import {Notification} from '../imports/collections/notification';
import {PageData} from '../imports/collections/page_data';
import moment from 'moment';

Meteor.startup(() => {
	
	var stripe = StripeAPI(Meteor.settings.StripePri);
	console.log('Server Online')
	var d = new Date();
	var n = d.getMinutes();
	var yesterday = moment(d).add(-1,'day').format("ll");
	var monthEnd = moment(new Date()).endOf('month').format("ll");
	console.log(monthEnd)
	console.log(yesterday);

	Meteor.setInterval(function() {
		//START of daily deal expiration check.
		
	    var d = new Date();
		var n = d.getMinutes();
		var today = moment(d).format("ll");
		monthEnd = moment(new Date()).endOf('month').format("ll");
		console.log(today, monthEnd)
		if(today!=yesterday){
			yesterday = today;
			//new day

			console.log("Conducting Daily Check");

			var allDandEs = DandE.find({expiration: today}).fetch();
			for(var i =0;i<allDandEs.length;i++){
				DandE.update(allDandEs[i]._id, {$set:{dealsOn: false}});
				var message = "Your deal - '"+allDandEs[i].title+"' - has reached its expiration date and expired.";
				Notification.insert({
					ownerId: allDandEs[i].topUser,
					pageOwner: allDandEs[i].forPage,
					message: message,
					type: "DD",
					createdAt: new Date(),
				});
			}
			var goingLive = DandE.find({startDate: today}).fetch();
			for(var i =0;i<goingLive.length;i++){
				DandE.update(goingLive[i]._id, {$set:{dealsOn: true}});
			}
			var allWrong = DandE.find({expiration: "Invalid date"}).fetch();
			console.log(allWrong.length, " Deals have an incorrect expiration.")
			for(var i =0;i<allWrong.length;i++){
				DandE.remove(allWrong[i]._id);

			}
			console.log(allDandEs.length, "deals went offline today.")
			//END of daily deal expiration check.
			//START daily rewards code recycle check.
			var allCodes = PageData.find({expiration: today}).fetch();
			for(var i =0;i<allCodes.length;i++){
				PageData.remove(allCodes[i]._id);
			}
			console.log(allCodes.length, "codes were deleted.")
			
			console.log('Check if page has sufficed a year.')
			var pageMonth = Pages.find({createdAt: today}).fetch();
			for(var i = 0; i < pageMonth.length; i++){
				Pages.update(pageMonth[i]._id, {$set: {monthlyCount: pageMonth[i].monthlyCount + 1}})
			}
			//var pagePay = Pages.find({createdAt: today, renewPage: true, monthlyCount: {$gt: 2}}).fetch();
			// var stripe = StripeAPI(Meteor.settings.StripePri);
			// for(var i = 0; i<pagePay.length;i++){
			// 	var profile = Profile.findOne({ownerId: pagePay.ownedBy[0]})
			// 	stripe.charges.create({
			//         amount: 1500,
			//         currency: "usd",
			//         customer: profile.stripeBusCust,
			//         description: "Monthly Udeal Charge.",
			//       	}, Meteor.bindEnvironment(function(error, result){
			//         if(error){
			//         	console.log(error)
			//           	throw "error";
			//           return;
			//         }else{
			// 	        var individual = profile.name;
			// 			var message = "User, "+individual+", has just purchased a $"+giftAmount.toString()+ " gift card at your organization for the user "+inFriendsList.name+".";
			// 			var type = "GC";

			// 			Notification.insert({
			// 				ownerId: pages.ownedBy[0],
			// 				pageOwner: pages._id,
			// 				message: message,
			// 				type: type,
			// 				createdAt: new Date(),
							
			// 			});
			// 		}
			// 	}))
			// }
		}
		
	}, 300000);
	//lets go every 5 mins ==== 5*60*1000 = 300,000

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
	Meteor.publish('onePage', function(pageID){
		var user = this.userId.toString();
		if(!user){
			return;
		}
		//add published:true
		return Pages.findOne({
			_id: pageID
		})
	});
	Meteor.publish('favPages', function(){
		var user = this.userId.toString();
		if(!user){
			return;
		}
		var profile = Profile.findOne({ownerId: user});
		return Pages.find({_id: {$in: profile.favPages}});

	})
	Meteor.publish('arrayPage', function(){
		var user = this.userId.toString();
		if(!user){
			return;
		}
		//add published:true
		var profile = Profile.findOne({ownerId: user});
		var pageArray = profile.goldMember;

		return Pages.find({
			_id:{$in: pageArray}
		}).fetch();
	});
	Meteor.publish('allPages', function(mobLL, range){
		var user = this.userId.toString();
		if(!user){
			return;
		}
		if(Array.isArray(mobLL)){
			var longlat = mobLL
		}
		else{
			var profile = Profile.findOne({ownerId: user});
			var longlat = [profile.longlat0,profile.longlat1];
		}

		if(range){
			if(range > .2 || range < .05){
				return;
			}
		}
		else{
			var range = .1;
		}
		//add published:true
		return Pages.find({published:true, longlat0: {$gt: (longlat[0]-range), $lt: (longlat[0]+range)}, longlat1: {$gt: (longlat[1]-range), $lt: (longlat[1]+range)}})
	});

	Meteor.publish('memOrgPage', function(pageID){
		var user = this.userId.toString();
		if(!user){
			return;
		}

		return Pages.findOne({_id: pageID})
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
	Meteor.publish('wgot', function(mobLL, range){
		var user = this.userId.toString();
		if(!user){
			return;
		}
		if(Array.isArray(mobLL)){
			var longlat = mobLL;
		}
		else{
			var profile = Profile.findOne({ownerId: user});
			var longlat = [profile.longlat0,profile.longlat1];
		}

		if(range){
			if(range > .2 || range < .05){
				return;
			}
		}
		else{
			var range = .1;
		}
		var pages = Pages.find({ longlat0: {$gt: (longlat[0]-range), $lt: (longlat[0]+range)}, longlat1: {$gt: (longlat[1]-range), $lt: (longlat[1]+range)}}).fetch();
		var pageIDs = [];
		for(var i = 0; i < pages.length;i++){
			pageIDs.push(pages[i]._id);
		}
		return DandE.find({dealsOn: true, forPage: {$in: pageIDs}}, { sort: {upvotes: -1}})
	});
	Meteor.publish('singleWgot', function(single){
		var user = this.userId.toString();
		if(!user){
			return;
		}
		return DandE.find({dealsOn: true, _id: single})
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
	Meteor.publish('memnotes', function(){
		var user = this.userId.toString();
		if(!user){
			return;
		}

		return Notification.find({ownerId: user, pageOwner: user});
	});
	Meteor.publish('altnotes', function(){
		console.log('here')
		var user = this.userId.toString();
		if(!user){
			return;
		}
		var profile = Profile.findOne({ownerId: user});
		var page = Pages.findOne({_id: profile.altnotes})
		if(!profile.altnotes){
			return;
		}
		var found = false;
		for(var i = 0; i<page.altnotes.length;i++){

			if(page.altnotes[i].email == profile.email){
				found = true;
			}
		}
		if(!found){

			return;
		}

		return Notification.find({pageOwner: page._id});
	});
	
	Meteor.publish("altnotesPage", function(){
		var user = this.userId.toString();
		if(!user){
			return;
		}
		var profile = Profile.findOne({ownerId: user});
		var page = Pages.findOne({_id: profile.altnotes})

		var found = false;
		if(!profile.altnotes){
			return;
		}
		for(var i = 0; i<page.altnotes.length;i++){

			if(page.altnotes[i].email == profile.email){
				found = true;
			}
		}
		if(!found){

			return;
		}

		return Pages.find({_id: profile.altnotes});
	});
});
