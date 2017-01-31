import {Pages} from '../imports/collections/pages';
import {DandE} from '../imports/collections/dande';
import moment from 'moment';

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
		var genDeals = DandE.find({forPage: pageID,typeDE:"DD"}).fetch();
		var goldDeals = DandE.find({forPage: pageID,typeDE:"GD"}).fetch();
		console.log(genDeals.length)
		if(genDeals.length > 5){
			return;
		}
		if(goldDeals.length > 5){
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
			image: 'http://i.imgur.com/791es57.png',
			numAttending: 0,
			upvotes: 0,
			timesUsed: 0,
			upvotedBy: [],
			usedBy: [],
			dateTime: "",
			title: '',
			description: '',
			expiration: '',
			longlat: page.longlat,
			createdAt: new Date(),
		});
	},
	'dande.updateDandE': function(pageID, dealID, dealinfo, desc, expi, maxn){
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
		if(deal.dealsOn){
			return;
		}
		if(deal.topUser != user){
			return;
		}
		if(isNaN(expi)){
			console.log('1')
			expi = 1;
		}
		if(typeof(expi) != "number"){
			console.log('not a num')
			return;
		}
		expi = parseInt(expi);
		if(expi < 1 && expi > 90){
			console.log('out of bounds')
			return;
		}

		var newExpi = moment(newExpi).add(expi,'days').format("ll"); 

		return DandE.update(dealID, {$set: {
			title: dealinfo,
			description: desc,
			expiration: newExpi,
			maxn: maxn,
			upvotes: 0,
			timesUsed: 0,
			upvotedBy: [],
			usedBy: [],
			dealsOn: true
			
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
		var newExpi = moment(dateTime).format("ll"); 
		return DandE.update(eventID, {$set: {
			title: title,
			dateTime: newExpi,
			description: description,
			dealsOn: published,
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