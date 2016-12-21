import {TomBook} from '../imports/collections/tombook';
import {Pages} from '../imports/collections/pages';
import {DandE} from '../imports/collections/dande';

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
		if(book.topUser != theUserId){
			return;
		}
		return TomBook.update(book._id, {$pull: {
			tbc: {theID: perid}
		}})
	},
	'tombook.cashItem': function(perid){
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
		console.log(book._id,'hi')
		var dande = DandE.findOne({_id: perid})
		console.log(dande._id,'jii')
		var page = Pages.findOne({_id: dande.forPage})
		console.log(dande._id,'hiii')
		console.log(page._id)
		Pages.update(page._id, {$set:{
			monthlyTransactions: page.monthlyTransactions + 1
		}})
		return TomBook.update(book._id, {$pull: {
			tbc: {theID: perid}
		}})
	}
});