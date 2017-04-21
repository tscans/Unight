import {Pages} from '../imports/collections/pages';
import {DandE} from '../imports/collections/dande';
import moment from 'moment';
var cloudinary = require('cloudinary');

function checker(value,typeOBJ){
	var returnValue;
	//number,boolean,string
	returnValue = (typeof(value) == typeOBJ);
	return returnValue;
}
function isValidDate(str) {
  var d = moment(str).format("ll");
  if(d == "Invalid date"){
  	return false;
  }
  else{
  	return true;
  }
}

var RANDICONS = [" fa-university"," fa-bell"," fa-bicycle"," fa-calculator"," fa-bullhorn"," fa-cube"," fa-diamond"," fa-coffee"," fa-bolt"," fa-gamepad"," fa-gift"," fa-hand-peace-o"," fa-fighter-jet"," fa-car"," fa-train"," fa-cog"," fa-money"," fa-wrench"," fa-tachometer"," fa-signal"," fa-music"," fa-heart"," fa-futbol-o"," fa-beer"," fa-cloud"," fa-bug"," fa-flag-checkered"," fa-gavel"," fa-newspaper-o"," fa-magnet"," fa-hand-rock-o","fa-anchor","fa-bullseye","fa-balance-scale","fa-binoculars","fa-cubes","fa-thumbs-up", "fa-spoon","fa-shield "];
var RANDCOLORS = ["red","blue", "green", "yellow", "orange", "purple", "black", "pink", "turquoise"];

function ulength(s, maxl){
	var returnValue;
	if(s.length > maxl){
		returnValue = false;
	}
	else{
		returnValue = true;
	}
	return returnValue;
}

Meteor.methods({
	'dande.makeDandE': function(pageID, typeDE){
		var user = this.userId.toString();
		const theUserId = Meteor.users.findOne(this.userId)._id;
		if (user != theUserId){
			return;
		}
		if(!(checker(pageID, "string") && checker(typeDE, "string"))){
	    	console.log('hacker')
	    	return;
	    }
	    if(!(ulength(pageID, 20))){
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

		if(genDeals.length > 5){
			return;
		}
		if(goldDeals.length > 5){
			return;
		}
		var randI = RANDICONS[Math.floor(Math.random() * RANDICONS.length)];
		var randC = RANDCOLORS[Math.floor(Math.random() * RANDCOLORS.length)];
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
			maxn: 0,
			description: '',
			expiration: '',
			startDate: "",
			cost: 0,
			randomIcon: randI,
			randomColor: randC,
			longlat0: page.longlat0,
			longlat1: page.longlat1,
			createdAt: new Date(),
		});
	},
	'dande.randomIC': function(dealID){
		var user = this.userId.toString();
		if (!user){
			return;
		}
		var deal = DandE.findOne({_id: dealID});
		if(deal.topUser != user){
			return;
		}
		var randI = RANDICONS[Math.floor(Math.random() * RANDICONS.length)];
		var randC = RANDCOLORS[Math.floor(Math.random() * RANDCOLORS.length)];
		return DandE.update(dealID, {$set: {randomIcon: randI, randomColor: randC}});
	},
	'dande.updateDandE': function(pageID, dealID, dealinfo, desc, expi, maxn, cost){
		var user = this.userId.toString();
		const theUserId = Meteor.users.findOne(this.userId)._id;
		if (user != theUserId){
			return;
		}
		const deal = DandE.findOne({
			_id: dealID
		})
		
		if(deal.typeDE != "GD" && deal.typeDE != "DD"){
			console.log(deal.typeDE)
			console.log('ah')
			return;
		}
		var majorType = "ready";
		if(deal.typeDE == "DD"){
			majorType = "daily";
			if(!checker(expi, "string")){
				console.log('ahh')
				return;
			}
		}

		else{
			if(!checker(cost, "number")){
				console.log(cost)
				console.log('ahhh')
				return;
			}
			if(cost < 5 || cost > 150){
				console.log('ahhhh')
				return;
			}
			if(!checker(expi, "number")){
				console.log('ahhhhhh')
				return;
			}
		}
		if(!(checker(pageID, "string") && checker(dealID, "string") && checker(dealinfo, "string") && checker(desc, "string") && checker(maxn, "number"))){
	    	console.log('hacker')
	    	return;
	    }
	    if(!(ulength(pageID, 20) && ulength(dealID, 20) && ulength(dealinfo, 25) && ulength(desc, 200))){
	    	console.log('ahhhhhhh')
	    	return;
	    }
		const page = Pages.findOne({
			_id: pageID
		})
		
		if(page._id != deal.forPage){
			console.log('ahg')
			return;
		}
		if(deal.dealsOn){
			console.log('ahgg')
			return;
		}
		if(deal.topUser != user){
			console.log('ahggg')
			return;
		}
		var timesUsed;
		if(majorType == "daily"){
			console.log(expi)
			if(!isValidDate(expi)){
				throw new Meteor.Error(512, 'Not a date.');
				return;
			}
			timesUsed = "daily";
			cost = 0;
			var newExpi = moment(expi).add(1,'days').format("ll");
			var startDate = moment(expi).format("ll");
			if(moment().diff(expi, 'days') > 0){
				throw new Meteor.Error(511, 'Date is in the past.');
				return;
			}
		}
		else{
			
			timesUsed = 0;
			if(expi < 1 || expi > 90){
				console.log('out of bounds')
				return;
			}
			var newExpi = moment(newExpi).add(expi,'days').format("ll"); 
			var startDate = moment(new Date()).format("ll");
		}
		if(majorType == "daily"){
			return DandE.update(dealID, {$set: {
				title: dealinfo,
				description: desc,
				expiration: newExpi,
				upvotes: 0,
				upvotedBy: [],
				usedBy: [],
				startDate: "",
				startDate: startDate
			}})
		}
		else{
			return DandE.update(dealID, {$set: {
				title: dealinfo,
				description: desc,
				expiration: newExpi,
				maxn: maxn,
				upvotes: 0,
				timesUsed: timesUsed,
				upvotedBy: [],
				usedBy: [],
				cost: cost,
				startDate: startDate
			}})
		}
		
		
		
	},
	'dande.publishDandE': function(pageID, dealID){
		var user = this.userId.toString();
		if(!user){
			console.log('ff')
			return;
		}
		if(!(checker(pageID, "string") && checker(dealID, "string"))){
			console.log('ffd')
			return;
		}
		if(!(ulength(pageID, 20) && ulength(dealID, 20))){
			console.log(pageID, dealID)
			console.log('ffs')
	    	return;
	    }
		const page = Pages.findOne({
			_id: pageID
		})
		const deal = DandE.findOne({
			_id: dealID
		})
		if((page.ownedBy[0] != user)){
			return;
		}
		var d = new Date();
		var today = moment(d).format("ll");
		if(deal.startDate != today && deal.typeDE=="DD"){
			return;
		}
		else{
			return DandE.update(dealID, {$set: {dealsOn: true}});
		}
	},
	'dande.imageDandE': function(pageID, dealID, pic){
		var user = this.userId.toString();
		const theUserId = Meteor.users.findOne(this.userId)._id;
		if (user != theUserId){
			return;
		}
		if(!(checker(pageID, "string") && checker(dealID, "string") && checker(pic, "string"))){
	    	console.log('hacker')
	    	return;
	    }
	    if(!(ulength(pageID, 20) && ulength(dealID, 20))){
	    	return;
	    }
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
		cloudinary.config({cloud_name: 'dee8fnpvt' , api_key: 'SECRET' , api_secret: 'SECRET'});
		cloudinary.v2.uploader.upload("data:image/png;base64,"+pic, function(error, result){
			if(error){
				console.log(error)
				return;
			}
		},Meteor.bindEnvironment(function (error, result) {
		  	DandE.update(dealID, {$set: {
				image: result.url
			}})
		}));
		
	},
	'dande.removeDandE': function(deal){
		var user = this.userId.toString();
		const theUserId = Meteor.users.findOne(this.userId)._id;
		if (user != theUserId){
			return;
		}
	    if(!(ulength(deal._id, 20))){
	    	return;
	    }

		var die = DandE.findOne({_id: deal._id});

		if(die.topUser != user){
			return;
		}
		return DandE.remove(deal)
	},
	'dande.updateEvents': function(pageID, eventID, title, dateTime, description, published, phyAddress){
		var user = this.userId.toString();
		const theUserId = Meteor.users.findOne(this.userId)._id;
		if (user != theUserId){
			return;
		}
		if(!(checker(pageID, "string") && checker(eventID, "string") && checker(title, "string") && checker(dateTime, "string") && checker(description, "string") && checker(published, "boolean") && checker(phyAddress, "string"))){
	    	console.log('hacker')
	    	return;
	    }
	    if(!(ulength(pageID, 20) && ulength(eventID, 20) && ulength(title, 25) && ulength(description, 200) && ulength(dateTime, 30) && ulength(phyAddress, 40))){
	    	return;
	    }
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
		if(moment().diff(dateTime, 'days') > 0){
			throw new Meteor.Error(511, 'Date is in the past.');
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
		if(!(checker(pageID, "string") && checker(eventID, "string") && checker(image, "string"))){
	    	console.log('hacker')
	    	return;
	    }
	    if(!(ulength(pageID, 20) && ulength(eventID, 20))){
	    	return;
	    }
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
		if(!(checker(dandeID, "string"))){
	    	console.log('hacker')
	    	return;
	    }
	    if(!(ulength(dandeID, 20))){
	    	return;
	    }
		const deal = DandE.findOne({
			_id: dandeID
		})
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
