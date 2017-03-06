import {Notification} from '../imports/collections/notification';
import {Pages} from '../imports/collections/pages';
import {DandE} from '../imports/collections/dande';
import {Profile} from '../imports/collections/profile';
import {TomBook} from '../imports/collections/tombook';
import {GiftCards} from '../imports/collections/giftcards';

function checker(value,typeOBJ){
	var returnValue;
	//number,boolean,string
	returnValue = (typeof(value) == typeOBJ);
	return returnValue;
}

function ulength(s, maxl){
	var returnValue;
	if(s.length > maxl){
		returnValue = false;
	}
	else{
		returnValue = true;
	}
	return returnValue;
}

Meteor.methods({
	'notification.newNotification': function(pageID, message, type){
		const theUserId = Meteor.users.findOne(this.userId)._id;
		if(!theUserId){
			return;
		}
		var count = Notification.find({_id: theUserId}).sort({"count" : -1}).limit(1);
		console.log(count);
		return Notification.insert({
			ownerId: theUserId,
			pageOwner: pageID,
			message: message,
			type: type,
			createdAt: new Date(),
			count: count,
			perid: ""

		});
	},
	'notification.deleteNotification':function(noteID){
		const theUserId = Meteor.users.findOne(this.userId)._id;
		if(!theUserId){
			return;
		}
		var note = Notification.findOne({_id: noteID});
		var theUserPro = Profile.findOne({ownerId: theUserId});
		var note = Notification.findOne({_id: noteID});
		var parpage = Pages.findOne({_id: note.pageOwner});
		if(!parpage){
			if(note.ownerId != theUserId){
				return;
			}
			return Notification.remove(noteID);
		}
		var anr = [];
		var worker = false;
		for(var x = 0; x< parpage.altnotes.length;x++){
			anr.push(parpage.altnotes[x].email)
		}
		if(anr.includes(theUserPro.email)){
			worker = true;
		}
		
		if(note.ownerId != theUserId || !worker){
			return;
		}
		return Notification.remove(noteID);
	},
	'notification.acceptNotification':function(noteID,work){
		const theUserId = Meteor.users.findOne(this.userId)._id;
		if(!theUserId){
			return;
		}

		var theUserPro = Profile.findOne({ownerId: theUserId});
		var note = Notification.findOne({_id: noteID});
		var parpage = Pages.findOne({_id: note.pageOwner});
		var anr = [];
		var worker = false;
		if(work){
			for(var x = 0; x< parpage.altnotes.length;x++){

				anr.push(parpage.altnotes[x].email)
			}
			if(anr.includes(theUserPro.email)){
				worker = true;
			}
			
			if(note.ownerId != theUserId || !worker){
				return;
			}
		}
		

		var dande = DandE.findOne({_id: note.perid});

		const book = TomBook.findOne({
			topUser: note.holdUser
		});
		var erase = false;
		
		if(!dande.dealsOn){
			throw new Meteor.Error(509, "This deal has expired. Please delete the notification.");
			return;
		}
		if((dande.maxn - 1) == dande.timesUsed){
			erase = true;
			
		}
		console.log('ha')

		var type = dande.typeDE;
		var page = Pages.findOne({_id: dande.forPage});
		DandE.update(note.perid, {$set:{
			timesUsed: dande.timesUsed + 1
		}})
		DandE.update(note.perid, {$push: {
			usedBy: note.holdUser
		}})

		TomBook.update(book._id, {$pull: {
			tbc: {theID: note.perid}
		}})

		console.log('ha')
		//Now to alert folks
		var umes = dande.forPageName+" has accepted the transaction for "+dande.title+".";
		Notification.insert({
			ownerId: note.holdUser,
			pageOwner: note.holdUser,
			message: umes,
			type: dande.type,
			createdAt: new Date(),
		});
		console.log('ha')
		if(erase){
			
			var message = "Your deal - '"+dande.title+"' - has reached "+dande.maxn.toString()+" uses and expired.";
			Notification.insert({
				ownerId: page.ownedBy[0],
				pageOwner: page._id,
				message: message,
				type: "GM",
				createdAt: new Date(),
			});
			DandE.update(note.perid, {$set: {
				dealsOn: false
				
			}})
		}
		console.log('ha')
		var allSameNotes = Notification.find({holdUser: note.holdUser, perid: note.perid}).fetch();
		console.log(allSameNotes.length, note.perid, note.holdUser)
		for(var i = 0; i<allSameNotes.length; i++){
			Notification.remove(allSameNotes[i]._id);
		}
		
	}
});