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
			aboutUs: aboutUs
		});
	},
	'pages.updatePage': function(page, name, address, pic, zip, about){
		return Pages.update(page._id, {$set: {
			orgName: name,
			proPict: pic,
			phyAddress: address,
			zipCode: zip,
			aboutUs: about,
		}})
	},
});

export const Pages = new Mongo.Collection('pages');

		