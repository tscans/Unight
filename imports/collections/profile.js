import {Mongo} from 'meteor/mongo';

Meteor.methods({
	'profile.makeUser': function(ema, pss1){
		ema = ema.toLowerCase();
		return Accounts.createUser({
			email: ema,
			password: pss1
		});
	},
	'profile.insertData': function(name, usid){
		const user = Meteor.users.findOne(this.userId)._id;
		return Profile.insert({
			createdAt: new Date(),
			name: name,
			ownerId: user,
			myPages: [],
			isUser: false,
			isAdmin: true,
			isSupAdmin: false
		});
	},
	'profile.addOwner': function(profile, pageId){
		const user = Meteor.users.findOne(this.userId)._id.toString();
		return Profile.update(profile._id, {$push:{myPages: pageId}});	
	}	
});

export const Profile = new Mongo.Collection('profile');

 