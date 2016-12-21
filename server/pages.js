import {Profile} from '../imports/collections/profile';
import {Pages} from '../imports/collections/pages';

Meteor.methods({
	'pages.makePage': function(orgName, proPict, phyAddress, zipCode, aboutUs){
		const theUserId = Meteor.users.findOne(this.userId)._id;
		return Pages.insert({
			ownedBy: [theUserId],
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
			monthlyTransactions: 0
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
		if(profileID.goldMember.includes(pageID)){
			return;
		}
		if(page.pageUsers.includes(user)){
			return;
		}
		Pages.update(page._id, {$push: {
			pageUsers: user
		}})
		return Profile.update(profileID._id, {$push: {
			goldMember: pageID
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
		Pages.update(page._id, {$pull: {
			pageUsers: user
		}})
		return Profile.update(profileID._id, {$pull: {
			goldMember: pageID
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