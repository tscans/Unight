import {Profile} from '../imports/collections/profile';
import {Pages} from '../imports/collections/pages';
import {Notification} from '../imports/collections/notification';
import moment from 'moment';

function emailBody(usid, code, business, dollars, today, expiration){
	var unsub = `http://unight.meteorapp.com/verify/email/`+usid+`/`+code+`/loginuser`;
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
<a href="http://unight.meteorapp.com"><img src='http://i.imgur.com/urR5bHp.png' height='200px' class="bump-top"/></a>
<h2>You are a member of `+business+`</h2>
<p>This means you now have access to gold deals at `+business+`.</p>
<p>You purchased membership for $`+dollars+` on `+today+`. This membership will expire on `+expiration+` and will automatically be renewed for the same amount unless you end the membership or reach the quota for deals in a month at `+business+` and become eligible for a free month of gold.</p>
<p>Be sure to visit `+business+` more often to use all the gold deals offered this month. Thanks for choosing Unight to be a loyal customer!</p>
<div class="bump-top bump-bot">
<p>Unight.io</p>
</div>
<p>If you wish to unsubscribe from future Unight emails click this <a href="`+unsub+`">link.</a></p>
</div>
</body>
</html>`;
}

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
		return Pages.insert({
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
			whoDealsMonthly: [],
			published: false,
			altnotes: []
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
	'pages.addAltNotes': function(pageID,email, name){
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
		email = email.toLowerCase();
		var profile = Profile.findOne({email: email});
		if(!profile){
			throw new Meteor.Error(530, 'Unight account not found.');
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
		Profile.update(profile._id,{$set:{altnotes: pageID}})
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
		const page = Pages.findOne({
			_id: pageID
		})
		if(page.ownedBy[0] != user){
			console.log('failed authentication')
			return;
		}
		var profile = Profile.findOne({email: email});
		if(!profile){
			throw new Meteor.Error(530, 'Unight account not found.');
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
		if(profileID.deactivate == true){
			throw new Meteor.Error(530, 'Your purchase abilities are deactivated.');
			return;
		}
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
		var iToday = moment(d).format("ll");
		var expiration = moment(d).add(1,'month').format("ll");
		Profile.update(profileID._id, {$pull: {
			goldMember: pageID,
			goldMemberChecks: {pageID: pageID}
		}})
		Profile.update(profileID._id, {$push: {
			goldMember: pageID,
			goldMemberChecks: {pageID: pageID, expiration: expiration, paid: true, continuity: true, amount: 500, orgName: page.orgName, proPict: page.proPict}
		}})
		var subject = "You Are A Member Of "+page.orgName;
		if(profileID.subscribeEmail){
			Email.send({
			  to: profileID.email,
			  from: "UnightMail@mail.unight.io",
			  subject: subject,
			  html: emailBody(profileID.ownerId, profileID.code, page.orgName, "5.00", iToday, expiration),
			});
		}
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