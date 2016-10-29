import {Mongo} from 'meteor/mongo';
import {TomBook} from './tombook';

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
				myPages: [],
				tomBook: tb,
				silverMember: [],
				goldMember: [],
				isSupAdmin: false
			});
		})
	},
	'profile.addOwner': function(profile, pageId){
		const user = Meteor.users.findOne(this.userId)._id.toString();
		return Profile.update(profile._id, {$push:{myPages: pageId}});	
	}
});

export const Profile = new Mongo.Collection('profile');

 