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
				myPages: [],
				tomBook: tb,
				silverMember: [],
				goldMember: [],
				isSupAdmin: false,
				cell: cell,
				userZip: zip
			});
		})
	},
	'profile.addOwner': function(profile, pageId){
		const user = Meteor.users.findOne(this.userId)._id.toString();
		return Profile.update(profile._id, {$push:{myPages: pageId}});	
	},
	'profile.updateZip': function(zip){
		const user = Meteor.users.findOne(this.userId)._id.toString();
		if(!user){
			return
		}
		return Profile.update(user, {zipCode: zip});	
	},
	'profile.deleteUser': function(password){
		const user = Meteor.users.findOne(this.userId)._id.toString();
		Meteor.users.remove({_id:user});
		return password;
	}
});

export const Profile = new Mongo.Collection('profile');

 