import {Profile} from '../imports/collections/profile';
import {Pages} from '../imports/collections/pages';
import {Notification} from '../imports/collections/notification';
import moment from 'moment';

Meteor.methods({
	'pages.makePage': function(){
		var orgName = '';
		var proPict = 'http://i.imgur.com/ahJEDUm.png';
		var phyAddress = '';
		var zipCode = '';
		var aboutUs = 'Tell users about your business here!';

		const theUserId = Meteor.users.findOne(this.userId)._id;
		var numPages = Pages.find({ownedBy: {$elemMatch: {$eq: theUserId}}}).count();
		var profile = Profile.findOne({ownerId: theUserId});
		if(!profile.businessVerified){
			return;
		}
		console.log(numPages);
		if((numPages+1)>3){
			return;
		}
		var profile = Profile.findOne({ownerId: theUserId});
		Pages.insert({
			ownedBy: [theUserId],
			createdAt: new Date(),
			orgName: orgName,
			proPict: proPict,
			phyAddress: phyAddress,
			pageUsers: [],
			zipCode: zipCode,
			aboutUs: aboutUs,
			website: "",
			hasDeals: false,
			hasMembers: false,
			hasEvents: false,
			hasGiftCards: false,
			allowedGifts: [],
			monthlyTransactions: 0,
			requiredForGold: null,
			whoDealsMonthly: []
		},
		function(error,data){
		  	if(error){
		  		console.log(error)
		  	}
		  	else{
		  		return Profile.update(profile._id, {$push:{myPages: pageId}});
		  	}

		});
	},
	'pages.dealsBool': function(hasDeals){
		var user = this.userId.toString();
		const theUserId = Meteor.users.findOne(this.userId)._id;
		if (user != theUserId){
			return;
		}
		const forPage = Page.findOne({
			ownedBy: {$elemMatch: {$eq: user}}
		})
		return Pages.update(forPage._id, {$set: {
			hasDeals: hasDeals
		}})
	},
	'pages.updatePage': function(pageID, name, address, zip, website, about, hasDeals, hasMembers, hasEvents, hasGiftCards){
		var user = this.userId.toString();
		const theUserId = Meteor.users.findOne(this.userId)._id;
		if (user != theUserId){
			return;
		}
		const page = Pages.findOne({
			_id: pageID
		})
		if(page.ownedBy[0] != user){
			console.log('failed authentication')
			return;
		}
		console.log(page._id)

		return Pages.update(pageID, {$set: {
			orgName: name,
			phyAddress: address,
			zipCode: zip,
			aboutUs: about,
			hasDeals: hasDeals,
			hasMembers: hasMembers,
			hasEvents: hasEvents,
			hasGiftCards: hasGiftCards,
			website: website
		}})
	},
	'pages.updateGoldRequire': function(pageID,requiredForGold){
		var user = this.userId.toString();
		const theUserId = Meteor.users.findOne(this.userId)._id;
		if (user != theUserId){
			return;
		}
		const page = Pages.findOne({
			_id: pageID
		})
		if(page.ownedBy[0] != user){
			console.log('failed authentication')
			return;
		}

		requiredForGold = parseInt(requiredForGold);
		if(requiredForGold > 10 || requiredForGold < 1){
			return;
		}
		return Pages.update(pageID, {$set: {
			requiredForGold: requiredForGold
		}})
	},
	'pages.updateGeo': function(pageID, longlat){
		var user = this.userId.toString();
		const theUserId = Meteor.users.findOne(this.userId)._id;
		if (user != theUserId){
			return;
		}
		const page = Pages.findOne({
			_id: pageID
		})
		if(page.ownedBy[0] != user){
			console.log('failed authentication')
			return;
		}
		console.log(page._id)

		return Pages.update(pageID, {$set: {
			longlat: longlat
		}})
	},
	'pages.updateImage': function(pageID, pic){
		var user = this.userId.toString();
		const theUserId = Meteor.users.findOne(this.userId)._id;
		if (user != theUserId){
			return;
		}
		const page = Pages.findOne({
			_id: pageID
		})
		if(page.ownedBy[0] != user){
			console.log('failed authentication')
			return;
		}
		return Pages.update(pageID, {$set: {
			proPict: pic
		}})
	},
	'pages.addGoldMember': function(pageID){
		var user = this.userId.toString();
		const theUserId = Meteor.users.findOne(this.userId)._id;
		if (user != theUserId){
			return;
		}
		const page = Pages.findOne({
			_id: pageID
		})
		const profileID = Profile.findOne({
			ownerId: theUserId
		})

		Pages.update(page._id, {$push: {
			pageUsers: user
		}})
		var individual = profileID.name;
		var message = "User, "+individual+", has just become a member of your organization.";
		var type = "GM";

		Notification.insert({
			ownerId: page.ownedBy[0],
			pageOwner: page._id,
			message: message,
			type: type,
			createdAt: new Date(),
			
		});
		var d = new Date();
		var expiration = moment(d).add(1,'month').format("ll");
		Profile.update(profileID._id, {$pull: {
			goldMember: pageID,
			goldMemberChecks: {pageID: pageID}
		}})
		return Profile.update(profileID._id, {$push: {
			goldMember: pageID,
			goldMemberChecks: {pageID: pageID, expiration: expiration, paid: true, continuity: true, amount: 500}
		}})
	},
	'pages.removeGoldMember': function(pageID){
		var user = this.userId.toString();
		const theUserId = Meteor.users.findOne(this.userId)._id;
		if (user != theUserId){
			return;
		}
		const page = Pages.findOne({
			_id: pageID
		})
		const profileID = Profile.findOne({
			ownerId: theUserId
		})
		function isPage(element) {
		  return element.pageID == pageID;
		}
		
		var proPackage = profileID.goldMemberChecks.find(isPage);
		proPackage.continuity = false;
		Pages.update(page._id, {$pull: {
			pageUsers: user
		}})
		Profile.update(profileID._id, {$pull: {
			goldMemberChecks: {pageID: pageID}
		}})
		return Profile.update(profileID._id, {$push: {
			goldMemberChecks: proPackage
		}})
	},
	'pages.changeGifts': function(pageID, cardArray){
		var user = this.userId.toString();
		const theUserId = Meteor.users.findOne(this.userId)._id;
		if (user != theUserId){
			return;
		}
		const page = Pages.findOne({
			_id: pageID
		})
		if(page.ownedBy[0] != user){
			console.log('failed authentication')
			return;
		}
		console.log(page._id)

		return Pages.update(pageID, {$set: {
			allowedGifts: cardArray
		}})
	}
});