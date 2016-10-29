import {Mongo} from 'meteor/mongo';

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
		var cont = true;
		book.tbc.map((t)=>{
			if(t.theID == deid){
				cont = false;
			}
		})
		if(cont){
			return TomBook.update(book._id, {$push: {
				tbc: {
					theID: deid,
					theType: type,
					createdAt: new Date()
				}
				
			}})
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
		return TomBook.update(book._id, {$pull: {
			tbc: {theID: perid}
		}})
	}
});

export const TomBook = new Mongo.Collection('tombook');

 