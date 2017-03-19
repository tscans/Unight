import {Profile} from '../imports/collections/profile';
import {Pages} from '../imports/collections/pages';
import {Notification} from '../imports/collections/notification';
import moment from 'moment';
var cloudinary = require('cloudinary');

function checker(value,typeOBJ){
	var returnValue;
	//number,boolean,string
	returnValue = (typeof(value) == typeOBJ);
	return returnValue;
}

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

function emailBody(usid, code, business, dollars, today, expiration){
	var unsub = `http://Udeal.meteorapp.com/verify/email/`+usid+`/`+code+`/loginuser`;
	return `<!DOCTYPE html>
<html>
<head>
<style>
  .bg-2 {
      background-image: -webkit-linear-gradient(30deg, rgba(150, 220, 255,1) 85%, #ffff00 85%);
      background-color: #522256;
      color: #666;
  }
  .bump-top{
    margin-top: 50px;
  }
  .bump-bot{
  	margin-bottom:150px;
  }
</style>
</head>
<body class="bg-2">
<div style='text-align:center; font-family: Arial, Helvetica, sans-serif; font-size:20px;'>
<a href="http://Udeal.meteorapp.com"><img src='http://i.imgur.com/vXs2ksV.png' height='200px' class="bump-top"/></a>
<h2>You are a member of `+business+`</h2>
<p>This means you now have access to gold deals at `+business+`.</p>
<p>You purchased membership for $`+dollars+` on `+today+`. This membership will expire on `+expiration+` and will automatically be renewed for the same amount unless you end the membership or reach the quota for deals in a month at `+business+` and become eligible for a free month of gold.</p>
<p>Be sure to visit `+business+` more often to use all the gold deals offered this month. Thanks for choosing Udeal to be a loyal customer!</p>
<div class="bump-top bump-bot">
<p>Udeal.io</p>
</div>
<p>If you wish to unsubscribe from future Udeal emails click this <a href="`+unsub+`">link.</a></p>
</div>
</body>
</html>`;
}

Meteor.methods({
	'pages.makePage': function(){
		var orgName = '';
		var proPict = 'http://i.imgur.com/791es57.png';
		var phyAddress = '';
		var zipCode = '';
		var aboutUs = 'Tell users about your business here!';

		const theUserId = Meteor.users.findOne(this.userId)._id;
		var numPages = Pages.find({ownedBy: {$elemMatch: {$eq: theUserId}}}).count();
		var profile = Profile.findOne({ownerId: theUserId});
		if(!profile.businessVerified){
			throw new Meteor.Error(590, "stripe-error");
			return;
		}
		if(!profile.stripeBusCust){
			throw new Meteor.Error(590, "stripe-error");
			return
		}
		if(!profile.stripeBusiness){
			throw new Meteor.Error(590, "stripe-error");
			return;
		}
		console.log(numPages);
		if((numPages+1)>3){
			throw new Meteor.Error(590, "stripe-error");
			return;
		}
		var d = new Date();
		var today = moment(d).format("ll");
		var profile = Profile.findOne({ownerId: theUserId});
		return Pages.insert({
			ownedBy: [theUserId],
			createdAt: today,
			orgName: orgName,
			proPict: proPict,
			phyAddress: phyAddress,
			zipCode: zipCode,
			aboutUs: aboutUs,
			website: "",
			hasDeals: true,
			hasMembers: true,
			allowedGifts: [],
			requiredForGoal: 5,
			moneyForGoal: 4,
			published: false,
			altnotes: [],
			monthlyCount: 0,
			renewPage: true
		},
		function(error,data){
		  	if(error){
		  		console.log(error)
		  	}
		  	else{
		  		console.log(data)
		  		Profile.update(profile._id, {$push:{myPages: data}});
		  	}

		});
	},
	'pages.dealsBool': function(hasDeals){
		var user = this.userId.toString();
		const theUserId = Meteor.users.findOne(this.userId)._id;
		if (user != theUserId){
			return;
		}
		const forPage = Pages.findOne({
			ownedBy: {$elemMatch: {$eq: user}}
		})
		return Pages.update(forPage._id, {$set: {
			hasDeals: hasDeals
		}})
	},
	'pages.updatePage': function(pageID, name, address, zip, website, about, hasDeals, hasMembers, hasEvents, hasGiftCards){
		if(!(checker(pageID, "string") && checker(name, "string") && checker(address, "string") && checker(zip, "string") && checker(website, "string") && checker(about, "string") && checker(hasDeals, "boolean") && checker(hasMembers, "boolean") && checker(hasEvents, "boolean") && checker(hasGiftCards, "boolean"))){
			console.log('hack attempt');
			return;
		}
		if(!(ulength(pageID, 20) && ulength(name, 50) && ulength(address, 50) && ulength(zip, 6) && ulength(website, 40) && ulength(about, 200))){
	    	return;
	    }
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
		if(pageID == "" && name == "" && address == "" && zip == ""){
			return;
		}
		if(!page.published){
			Pages.update(page._id, {$set:{published: true}})
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
	'pages.updateGoalRequire': function(pageID,requiredForGoal, moneyForGoal){
		var user = this.userId.toString();
		if(isNaN(requiredForGoal) && isNaN(moneyForGoal)){
			console.log('hacker')
	        return;
	    }
	    if(!(checker(pageID, "string") && checker(requiredForGoal, "number") && checker(moneyForGoal, "number"))){
	    	console.log('hacker')
	    	return;
	    }
	    if(!(ulength(pageID, 20))){
	    	return;
	    }
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

		if(requiredForGoal > 16 || requiredForGoal < 4){
			return;
		}
		if(moneyForGoal > 12 || moneyForGoal < 2){
			return;
		}
		return Pages.update(pageID, {$set: {
			requiredForGoal: requiredForGoal,
			moneyForGoal: moneyForGoal
		}})
	},
	'pages.addAltNotes': function(pageID,email, name){
		var user = this.userId.toString();
		const theUserId = Meteor.users.findOne(this.userId)._id;
		if (user != theUserId){
			return;
		}
		if(!(checker(pageID, "string") && checker(email, "string") && checker(name, "string"))){
	    	console.log('hacker')
	    	return;
	    }
	    if(!(ulength(pageID, 20) && ulength(email, 50) && ulength(name, 25))){
	    	return;
	    }
		const page = Pages.findOne({
			_id: pageID
		})
		if(page.ownedBy[0] != user){
			console.log('failed authentication')
			return;
		}
		email = email.toLowerCase();
		var profile = Profile.findOne({email: email});
		if(!profile){
			throw new Meteor.Error(530, 'Udeal account not found.');
			return;
		}
		var already = false;
		for(var i = 0; i<page.altnotes.length;i++){
			if(page.altnotes[i].email == email){
				already = true;
			}
		}
		if(already){
			throw new Meteor.Error(530, 'User already in list.');
			return;
		}
		console.log(pageID)
		console.log('altnotes')
		console.log(profile._id)
		Profile.update(profile._id,{$set:{"altnotes": pageID}})
		return Pages.update(pageID, {$push: {
			altnotes: {email:email,name:name}
		}})
	},
	'pages.removeAltNotes': function(pageID,email){
		var user = this.userId.toString();
		const theUserId = Meteor.users.findOne(this.userId)._id;
		if (user != theUserId){
			return;
		}
		if(!(checker(pageID, "string") && checker(requiredForGoal, "number"))){
	    	console.log('hacker')
	    	return;
	    }
		const page = Pages.findOne({
			_id: pageID
		})
		if(page.ownedBy[0] != user){
			console.log('failed authentication')
			return;
		}
		var profile = Profile.findOne({email: email});
		if(!profile){
			throw new Meteor.Error(530, 'Udeal account not found.');
			return;
		}
		Profile.update(profile._id,{$set:{altnotes: null}})
		return Pages.update(pageID, {$pull: {
			altnotes: {email:email}
		}})
	},
	'pages.updateGeo': function(pageID, longlat){
		var user = this.userId.toString();
		const theUserId = Meteor.users.findOne(this.userId)._id;
		if (user != theUserId){
			return;
		}
		if(!(checker(pageID, "string") && checker(longlat[0], "number") && checker(longlat[1], "number"))){
	    	console.log('hacker')
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
			longlat0: longlat[0],
			longlat1: longlat[1]
		}})
	},
	'pages.updateImage': function(pageID, pic){
		var user = this.userId.toString();
		const theUserId = Meteor.users.findOne(this.userId)._id;
		if (user != theUserId){
			return;
		}
		if(!(checker(pageID, "string") && checker(pic, "string"))){
	    	console.log('hacker')
	    	return;
	    }
		const page = Pages.findOne({
			_id: pageID
		})
		if(page.ownedBy[0] != user){
			console.log('failed authentication')
			return;
		}

		cloudinary.config({cloud_name: 'dee8fnpvt' , api_key: '723549153244873' , api_secret: 'rooq670hgNK0JnoOSpxnZ7vFtG8'});
		cloudinary.v2.uploader.upload("data:image/png;base64,"+pic, function(error, result){
			if(error){
				console.log(error)
				return;
			}
		},Meteor.bindEnvironment(function (error, result) {
			console.log(result)
		  	Pages.update(pageID, {$set: {
				proPict: result.url
			}})
		}));
		
	},
	'pages.changeGifts': function(pageID, cardArray){
		var user = this.userId.toString();
		const theUserId = Meteor.users.findOne(this.userId)._id;
		if (user != theUserId){
			return;
		}
		if(!(checker(pageID, "string") && checker(cardArray[0], "boolean") && checker(cardArray[1], "boolean") && checker(cardArray[2], "boolean") && checker(cardArray[3], "boolean"))){
	    	console.log('hacker')
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