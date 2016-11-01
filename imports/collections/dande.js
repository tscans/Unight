import {Mongo} from 'meteor/mongo'; 
import {Pages} from './pages';

Meteor.methods({
	'dande.makeDandE': function(pageID, typeDE){
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
		if(page.phyAddress == ""){
			return;
		}
		console.log(page._id)
		return DandE.insert({
			topUser: user,
			forPage: page._id,
			dealsOn: false,
			typeDE: typeDE,
			forPageName: page.orgName,
			zipOfPage: page.zipCode,
			phyAddress: page.phyAddress,
			image: 'http://i.imgur.com/urR5bHp.png',
			numAttending: 0,
			upvotes: 0,
			upvotedBy: [],
			dateTime: "Date",
			title: 'Title',
			description: 'Description',
			expiration: 'Expiration',
			published: false
		});
	},
	'dande.updateDandE': function(pageID, dealID, dealinfo, desc, expi, checkb){
		var user = this.userId.toString();
		const theUserId = Meteor.users.findOne(this.userId)._id;
		if (user != theUserId){
			return;
		}
		console.log(pageID)
		console.log(dealID)
		const page = Pages.findOne({
			_id: pageID
		})
		const deal = DandE.findOne({
			_id: dealID
		})
		if(page._id != deal.forPage){
			return;
		}
		if(deal.topUser != user){
			return;
		}
		console.log(checkb)
		return DandE.update(dealID, {$set: {
			title: dealinfo,
			description: desc,
			expiration: expi,
			dealsOn: checkb
			
		}})
	},
	'dande.imageDandE': function(pageID, dealID, image){
		var user = this.userId.toString();
		const theUserId = Meteor.users.findOne(this.userId)._id;
		if (user != theUserId){
			return;
		}
		console.log(pageID)
		console.log(dealID)
		const page = Pages.findOne({
			_id: pageID
		})
		const deal = DandE.findOne({
			_id: dealID
		})
		if(page._id != deal.forPage){
			return;
		}
		if(deal.topUser != user){
			return;
		}
		return DandE.update(dealID, {$set: {
			image: image
			
		}})
	},
	'dande.removeDandE': function(deal){
		return DandE.remove(deal)
	},
	'dande.updateEvents': function(pageID, eventID, title, dateTime, description, published, phyAddress){
		var user = this.userId.toString();
		const theUserId = Meteor.users.findOne(this.userId)._id;
		if (user != theUserId){
			return;
		}
		console.log(pageID)
		console.log(eventID)
		const page = Pages.findOne({
			_id: pageID
		})
		const event = DandE.findOne({
			_id: eventID
		})
		if(page._id != event.forPage){
			return;
		}
		if(event.topUser != user){
			return;
		}
		return DandE.update(eventID, {$set: {
			title: title,
			dateTime: dateTime,
			description: description,
			published: published,
			phyAddress: phyAddress,
			
		}})
	},
	'dande.eventImage': function(pageID, eventID, image){
		var user = this.userId.toString();
		const theUserId = Meteor.users.findOne(this.userId)._id;
		if (user != theUserId){
			return;
		}
		console.log(pageID)
		console.log(eventID)
		const page = Pages.findOne({
			_id: pageID
		})
		const deal = DandE.findOne({
			_id: eventID
		})
		if(page._id != deal.forPage){
			return;
		}
		if(deal.topUser != user){
			return;
		}
		return DandE.update(eventID, {$set: {
			image: image
			
		}})
	},
	'dande.upvotes': function(dandeID){
		var user = this.userId.toString();
		const theUserId = Meteor.users.findOne(this.userId)._id;
		if (user != theUserId){
			return;
		}
		const deal = DandE.findOne({
			_id: dandeID
		})
		console.log(theUserId)
		if(deal.upvotedBy.includes(theUserId)){
			DandE.update(dandeID, {$pull: {
				upvotedBy: theUserId
			}})
			return DandE.update(dandeID, {$set: {
				upvotes: deal.upvotes - 1
			}})
		}
		DandE.update(dandeID, {$push: {
			upvotedBy: theUserId
		}})
		return DandE.update(dandeID, {$set: {
			upvotes: deal.upvotes + 1
		}})
	}
});

export const DandE = new Mongo.Collection('dande');
