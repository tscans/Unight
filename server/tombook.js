import {TomBook} from '../imports/collections/tombook';
import {Pages} from '../imports/collections/pages';
import {DandE} from '../imports/collections/dande';
import {Profile} from '../imports/collections/profile';
import {Notification} from '../imports/collections/notification';

Meteor.methods({
	'tombook.initTomBook': function(usid){
		return TomBook.insert({
			topUser: usid,
			tbc: []
		});
	},
	'tombook.updateBook': function(deid, type){
		const theUserId = Meteor.users.findOne(this.userId)._id;
		if(!theUserId){
			return;
		}
		const book = TomBook.findOne({
			topUser: theUserId
		})
		const userProfile = Profile.findOne({
			ownerId: theUserId
		})
		const dande = DandE.findOne({
			_id: deid
		})
		type = dande.typeDE
		var cont = true;
		book.tbc.map((t)=>{
			if(t.theID == deid){
				cont = false;
			}
		})
		console.log(type);
		if(type == "GD"){
			if(!(userProfile.goldMember.includes(dande.forPage))){
				console.log('Not a member.')
				throw new Meteor.Error(501, "This user is not a member.");
			}
		}
		if(dande.usedBy.indexOf(theUserId) != -1){
			console.log('Not a membereee.')
			throw new Meteor.Error(509, "This user already used this deal.");
		}
		if(cont){
			TomBook.update(book._id, {$push: {
				tbc: {
					theID: deid,
					theType: type,
					createdAt: new Date()
				}
				
			}})
			if(dande.typeDE == "E"){
				DandE.update(dande._id, {$set: {
					numAttending: dande.numAttending + 1
				}})
			}
		}
		
		
	},
	'tombook.removeItem': function(perid){
		const theUserId = Meteor.users.findOne(this.userId)._id;
		if(!theUserId){
			return;
		}
		const book = TomBook.findOne({
			topUser: theUserId
		})
		if(book.topUser != theUserId){
			return;
		}
		var dande = DandE.findOne({
			_id: perid
		})
		TomBook.update(book._id, {$pull: {
			tbc: {theID: perid}
		}})
		console.log(perid)
		DandE.update(perid, {$set: {
			numAttending: dande.numAttending - 1
		}})
	},
	'tombook.cashItem': function(perid){
		const theUserId = Meteor.users.findOne(this.userId)._id;
		if(!theUserId){
			return;
		}
		const book = TomBook.findOne({
			topUser: theUserId
		});
		const user = Profile.findOne({
			ownerId: theUserId
		});
		if(book.topUser != theUserId){
			return;
		}
		const profile = Profile.findOne({ownerId: theUserId});
		//good to go
		var dande = DandE.findOne({_id: perid});
		if(dande.typeDE =="E"){
			throw new Meteor.Error(505, "Cant cash Events");
			return;
		}
		
		var page = Pages.findOne({_id: dande.forPage});

		if(dande.usedBy.indexOf(theUserId) != -1){
			throw new Meteor.Error(502, "User already used this deal.");
			return;
		}
		Profile.update(profile._id, {$set:{
				todayDeals: (profile.todayDeals+1)
			}
		})
		if(profile.todayDeals > 10){
			throw new Meteor.Error(508, "You have used too many deals today. (10 MAX)");
			return;
		}
		//flags over
		
		var individual = user.name;
		var message = "User, "+individual+", used the deal '"+dande.title+"'.";
		var type = dande.typeDE;


		Notification.insert({
			ownerId: page.ownedBy[0],
			pageOwner: page._id,
			message: message,
			type: type,
			perid: perid,
			holdUser: theUserId,
			createdAt: new Date(),
		});
	}
});