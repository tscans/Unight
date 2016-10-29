import {Mongo} from 'meteor/mongo';

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
			hasDeals: false
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
	'pages.updatePage': function(pageID, name, address, zip, about, hasDeals){
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
			hasDeals: hasDeals
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
	}
});

export const Pages = new Mongo.Collection('pages');

		