import {Mongo} from 'meteor/mongo';

Meteor.methods({
	'uprofile.makeUser': function(ema, pss1){
		ema = ema.toLowerCase();
		return Accounts.createUser({
			email: ema,
			password: pss1
		});
	},
	'uprofile.insertData': function(name, usid){
		const user = Meteor.users.findOne(this.userId)._id;
		console.log(user)
		return UProfile.insert({
			createdAt: new Date(),
			name: name,
			ownerId: user,
			silverMember: [],
			goldMember: [],
			isUser: true,
			isAdmin: false,
			isSupAdmin: false
		});
	},
	'uprofile.updateData': function(profile, zipcode){
		const user = Meteor.users.findOne(this.userId)._id;
		return UProfile.update(profile._id, {$set: { zipCode: zipcode}})
	}
});

export const UProfile = new Mongo.Collection('uprofile');

 