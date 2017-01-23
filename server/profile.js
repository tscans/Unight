import {Profile} from '../imports/collections/profile';
import {Pages} from '../imports/collections/pages';

Meteor.methods({
	'profile.makeUser': function(ema, pss1){
		ema = ema.toLowerCase();
		return Accounts.createUser({
			email: ema,
			password: pss1
		});
	},
	'profile.insertData': function(name, usid, cell, zip){
		const user = Meteor.users.findOne(this.userId)._id;
		Meteor.call('tombook.initTomBook', usid, (error,data)=>{
			if(error){
				console.log(error)
			}
			else{
				console.log('worked')
				console.log(data)
				var tb = data.toString()
			}
			return Profile.insert({
				createdAt: new Date(),
				name: name,
				ownerId: user,
				email: Meteor.user().emails[0].address,
				myPages: [],
				tomBook: tb,
				goldMember: [],
				goldMemberChecks: [],
				isSupAdmin: false,
				cell: cell,
				userZip: zip,
				giftCards: [],
				businessVerified: false,
				liveProfile: true,
				friendUsers: [],
				stripeBusiness: null
			});
		})
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
		return Profile.update(profile._id, {zipCode: zip});	
	},
	'profile.addFriend': function(number, name){
		const user = Meteor.users.findOne(this.userId)._id.toString();
		if(!user){
			return
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
	}
});