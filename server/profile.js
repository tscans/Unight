import {Profile} from '../imports/collections/profile';
import {Pages} from '../imports/collections/pages';
import {Notification} from '../imports/collections/notification';
import {TomBook} from '../imports/collections/tombook';
import {PageData} from '../imports/collections/page_data';
var zipcodes = require('zipcodes');
import moment from 'moment';

function makePass(){
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for( var i=0; i < 10; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function emailBody(usid,code){
	var user = `http://www.Unight.io/verify/ver/`+usid+`/`+code+`/loginuser`;
	var bus = `http://www/Unight.io/verify/ver/`+usid+`/`+code+`/loginorg`;
	var unsub = `http://www.Unight.io/verify/email/`+usid+`/`+code+`/loginuser`;
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
<a href="http://www.Unight.io"><img src='http://i.imgur.com/vXs2ksV.png' height='200px' class="bump-top"/></a>
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

function emailRecover(usid,code){
	var rec = `http://www.Unight.io/recover/`+code+`/`+usid;
	var unsub = `http://www.Unight.io/verify/email/`+usid+`/`+code+`/loginuser`;
	return `<!DOCTYPE html>
<html>
<head>
<style>
  .bg-2 {
      background-color: #64CDF4;
      background-image: -webkit-linear-gradient(30deg, #64CDF4 65%, #682c6d 65%);
      background-color: #522256;
      color: #666666;
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
<a href="http://www.Unight.io"><img src='http://i.imgur.com/vXs2ksV.png' height='200px' class="bump-top"/></a>
<h1>Unight Recover Account</h1>
<p>Please user the following `+code.toString()+` to verify yourself and reset your password.</p>
<div class="bump-top">
<p>Unight.io</p>
<p>If you wish to unsubscribe from future Unight emails click this <a href="`+unsub+`">link</a></p>
</div>
</div>
</body>
</html>`;
}

function newPass(usid,code){
	var rec = `http://www.Unight.io/recover/`+code+`/`+usid;
	var unsub = `http://www.Unight.io/verify/email/`+usid+`/`+code+`/loginuser`;
	return `<!DOCTYPE html>
<html>
<head>
<style>
  .bg-2 {
      background-color: #64CDF4;
      background-image: -webkit-linear-gradient(30deg, #64CDF4 65%, #682c6d 65%);
      background-color: #522256;
      color: #666666;
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
<a href="http://www.Unight.io"><img src='http://i.imgur.com/vXs2ksV.png' height='200px' class="bump-top"/></a>
<h1>Unight Recover Account</h1>
<p>Here is your new password: `+code+`</p>
<p>Please login and change your password as soon as possible.</p>
<div class="bump-top">
<p>Unight.io</p>
<p>If you wish to unsubscribe from future Unight emails click this <a href="`+unsub+`">link</a></p>
</div>
</div>
</body>
</html>`;
}

Meteor.methods({
	'profile.makeUser': function(name, zip){
		const user = Meteor.users.findOne(this.userId)._id;
		var profile = Profile.findOne({ownerId: user});
		if(profile){
			console.log("User already exists")
			throw new Meteor.Error(510, 'User with email already exists.');
			return;
		}
		console.log(zip)
		var zippy = zipcodes.lookup(zip);

		TomBook.insert({
			topUser: user,
			tbc: []
		});
		var proEmail = Meteor.user().emails[0].address.toLowerCase();
		var random = Math.floor(Math.random() * (999999 - 111111)) + 111111;
		Profile.insert({
			createdAt: new Date(),
			name: name,
			ownerId: user,
			email: proEmail,
			myPages: [],
			goldMember: [],
			memberAllowance: 1,
			moonDate: null,
			isSupAdmin: false,
			userZip: zip,
			giftCards: [],
			todayDeals: 0,
			businessVerified: false,
			liveProfile: false,
			friendUsers: [],
			rewards: [],
			favPages: [],
			stripeBusiness: null,
			code: random.toString(),
			subscribeEmail: true,
			deactivate: false,
			longlat0: zippy.latitude,
			longlat1: zippy.longitude
		});

		
		Email.send({
		  to: Meteor.user().emails[0].address,
		  from: "UnightMail@mail.Unight.io",
		  subject: "Welcome to Unight!",
		  html: emailBody(user, random),
		});
		
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
	'profile.resetPass': function(email){
		var thisGuy = Profile.findOne({email: email});
		if(thisGuy){
			var d = new Date();
			var tomorrow = moment(d).add(1,'day').format("ll");
			var code = Math.floor(Math.random() * (999999 - 111111)) + 111111;
			PageData.insert({
				type: "recover",
				expiration: tomorrow,
				user: thisGuy.ownerId,
				code: code.toString()
			})
			Email.send({
			  to: thisGuy.email,
			  from: "UnightMail@mail.Unight.io",
			  subject: "Unight Recover Password",
			  html: emailRecover(thisGuy.ownerId, code.toString()),
			});
			return;
		}
		else{
			throw new Meteor.Error(588, 'Unight account not found.');
			return;
		}
	},
	'profile.newPass': function(code){
		code = code.toString();
		var pd = PageData.findOne({type: "recover", code: code});
		var np = makePass();
		console.log(np)
		console.log(pd.user)
		if(pd){
			var thisGuy = Profile.findOne({ownerId: pd.user});
			console.log('reseting')
			Accounts.setPassword(pd.user, np);
			Email.send({
			  to: thisGuy.email,
			  from: "UnightMail@mail.Unight.io",
			  subject: "Unight Recover Password",
			  html: newPass(thisGuy.ownerId, np),
			});
			return;
		}
		else{
			throw new Meteor.Error(589, 'Incorrect Code.');
			return;
		}
	},
	'profile.addFavPage': function(pageID){
		const user = Meteor.users.findOne(this.userId)._id.toString();
		if(!user){
			return
		}
		var page = Pages.findOne({_id: pageID});
		if(!page){
			throw new Meteor.Error(587, 'Business not found.');
			return;
		}
		var profile = Profile.findOne({ownerId: user});
		return Profile.update(profile._id, {$push:{favPages: pageID}});	

	},
	'profile.removeFavPage': function(pageID){
		const user = Meteor.users.findOne(this.userId)._id.toString();
		if(!user){
			return
		}
		var page = Pages.findOne({_id: pageID});
		if(!page){
			throw new Meteor.Error(587, 'Business not found.');
			return;
		}
		var profile = Profile.findOne({ownerId: user});
		return Profile.update(profile._id, {$pull:{favPages: pageID}});	

	}
});








