import {Profile} from '../imports/collections/profile';
import {Pages} from '../imports/collections/pages';
import {Notification} from '../imports/collections/notification';
var zipcodes = require('zipcodes');
import moment from 'moment';



function emailBody(usid,code){
	var user = `http://unight.meteorapp.com/verify/ver/`+usid+`/`+code+`/loginuser`;
	var bus = `http://unight.meteorapp.com/verify/ver/`+usid+`/`+code+`/loginorg`;
	var unsub = `http://unight.meteorapp.com/verify/email/`+usid+`/`+code+`/loginuser`;
	return `<!DOCTYPE html>
<html>
<head>
<style>
  .bg-2 {
      background-color: #522256;
      background-image: -webkit-linear-gradient(30deg, #522256 65%, #682c6d 65%);
      background-color: #522256;
      color: #ffffff;
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
<div style='text-align:center; font-family: Arial, Helvetica, sans-serif; font-size:20px; color: white;'>
<a href="http://unight.meteorapp.com"><img src='http://i.imgur.com/vXs2ksV.png' height='200px' class="bump-top"/></a>
<h1>Welcome to Unight!</h1>
<p>We hope you enjoy great deals! Click <a href="`+user+`">here</a> to verify your account and sign in as a user. </p>
<p>Or if you are a business owner, feel free to <a href="`+bus+`">create a page</a> and try out our services.</p>
<p>Don't forget to go mobile with our app! Available on iOS and Android.</p>
<div class="bump-top">
<p>Unight.io</p>
<p>If you wish to unsubscribe from future Unight emails click this <a href="`+unsub+`">link</a></p>
</div>
</div>
</body>
</html>`;
}

Meteor.methods({
	'profile.makeUser': function(name, cell, zip){
		const user = Meteor.users.findOne(this.userId)._id;
		var profile = Profile.findOne({ownerId: user});
		if(profile){
			console.log("User already exists")
			throw new Meteor.Error(510, 'User with email already exists.');
			return;
		}
		var zippy = zipcodes.lookup(zip);

		Meteor.call('tombook.initTomBook', user, (error,data)=>{
			if(error){
				console.log(error)
			}
			else{
				console.log('worked')
				console.log(data)
				var tb = data.toString()
			}
			var random = Math.floor(Math.random() * (999999 - 111111)) + 111111;
			Email.send({
			  to: Meteor.user().emails[0].address,
			  from: "UnightMail@mail.unight.io",
			  subject: "Welcome to Unight!",
			  html: emailBody(user, random),
			});
			var proEmail = Meteor.user().emails[0].address.toLowerCase();
			return Profile.insert({
				createdAt: new Date(),
				name: name,
				ownerId: user,
				email: proEmail,
				myPages: [],
				tomBook: tb,
				goldMember: [],
				memberAllowance: 1,
				moonDate: null,
				isSupAdmin: false,
				cell: cell,
				userZip: zip,
				giftCards: [],
				todayDeals: 0,
				businessVerified: false,
				liveProfile: false,
				friendUsers: [],
				stripeBusiness: null,
				code: random.toString(),
				subscribeEmail: true,
				deactivate: false,
				longlat0: zippy.latitude,
				longlat1: zippy.longitude
			});
		})
	},
	'profile.verifyUser': function(usid, code){
		var profile = Profile.findOne({ownerId: usid});
		code = code.toString();
		if(code != profile.code){
			console.log('failed')
			return;
		}
		return Profile.update(profile._id, {$set:{liveProfile: true}});	
	},
	'profile.unSubEmail': function(usid, code){
		var profile = Profile.findOne({ownerId: usid});
		code = code.toString();
		if(code != profile.code){
			console.log('failed')
			return;
		}
		return Profile.update(profile._id, {$set:{subscribeEmail: false}});	
	},
	'profile.addOwner': function(profile, pageId){
		const user = Meteor.users.findOne(this.userId)._id.toString();
		var profile = Profile.findOne({ownerId: user});
		return Profile.update(profile._id, {$push:{myPages: pageId}});	
	},
	'profile.updateZip': function(zip){
		const user = Meteor.users.findOne(this.userId)._id.toString();
		if(!user){
			return
		}
		var profile = Profile.findOne({ownerId: user});
		return Profile.update(profile._id, {$set:{userZip: zip}});	
	},
	'profile.addFriend': function(number, name){
		const user = Meteor.users.findOne(this.userId)._id.toString();
		if(!user){
			return
		}
		var profile = Profile.findOne({email: number});
		if(!profile){
			throw new Meteor.Error(530, 'Unight account not found.');
			return;
		}
		number = number.toString();
		//inside friend users breaks down as name: and number:
		var profile = Profile.findOne({ownerId: user});
		return Profile.update(profile._id, {$push:{friendUsers: {number:number,name:name}}});	
	},
	'profile.removeFriend': function(number){
		const user = Meteor.users.findOne(this.userId)._id.toString();
		if(!user){
			return
		}
		number = number.toString();
		var profile = Profile.findOne({ownerId: user});
		return Profile.update(profile._id, {$pull:{friendUsers: {number:number}}});	
	},
	'profile.deactivateUser': function(delp){
		const user = Meteor.users.findOne(this.userId)._id.toString();
		if(!user){
			return
		}
		if(delp!="confirm"){
			return;
		}
		var profile = Profile.findOne({ownerId: user});
		return Profile.update(profile._id, {$set:{deactivate: true}});	
	},
	'profile.activateUser': function(delp){
		const user = Meteor.users.findOne(this.userId)._id.toString();
		if(!user){
			return
		}
		if(delp!="confirm"){
			return;
		}
		var profile = Profile.findOne({ownerId: user});
		return Profile.update(profile._id, {$set:{deactivate: false}});	
	},
	'profile.placeLL': function(longlat){
		const user = Meteor.users.findOne(this.userId)._id.toString();
		if(!user){
			return
		}

		var profile = Profile.findOne({ownerId: user});
		return Profile.update(profile._id, {$set:{longlat0: longlat[0], longlat1: longlat[1]}});	
	},
	'profile.moonMember': function(){
		const user = Meteor.users.findOne(this.userId)._id.toString();
		if(!user){
			return
		}
		var profile = Profile.findOne({ownerId: user});
		if(!profile.stripeCust){
			throw new Meteor.Error(588, 'You need a credit card on file to purchase Moon Membership.');
			return;
		}
		//add email thank


		var stripe = StripeAPI(Meteor.settings.StripePri);
		stripe.charges.create({ 
	        amount: 500,
	        currency: "usd",
	        customer: profile.stripeCust,
	        description: "Moon Membership"
	      	}, Meteor.bindEnvironment(function(error, result){
	        if(error){
	        	console.log(error)
	        }else{
				
	        }
	    }));
		var message = "You have been charged $5.00 for Moon Membership. Thanks for supporting Unight!";
		var type = "GCD";

		Notification.insert({
			ownerId: user,
			pageOwner: user,
			message: message,
			type: type,
			createdAt: new Date(),
			
		});
		var d = new Date();
		var expiration = moment(d).add(1,'month').format("ll");
		return Profile.update(profile._id, {$set:{memberAllowance: 5, moonDate: expiration}});
	},
	'profile.noMoonMember': function(){
		const user = Meteor.users.findOne(this.userId)._id.toString();
		if(!user){
			return
		}
		var profile = Profile.findOne({ownerId: user});
		//remove 4 of their memberships, done
		for(var i=0;i<profile.goldMember.length;i++){
			Pages.update(profile.goldMember[i], {$pull: {
				pageUsers: user
			}})
		}
		
		Profile.update(profile._id, {$set:{goldMember: []}});
		if(profile.goldMember.length > 0){
			Profile.update(profile._id, {$push: {
				goldMember: profile.goldMember[0]
			}})
			Pages.update(profile.goldMember[0], {$push:{
				pageUsers: user
			}})
		}
		
		
		return Profile.update(profile._id, {$set:{memberAllowance: 1}});
	}
});








