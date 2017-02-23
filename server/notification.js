import {Notification} from '../imports/collections/notification';
import {Pages} from '../imports/collections/pages';
import {DandE} from '../imports/collections/dande';
import {Profile} from '../imports/collections/profile';
import {TomBook} from '../imports/collections/tombook';
import {GiftCards} from '../imports/collections/giftcards';

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
	'notification.acceptNotification':function(noteID){
		const theUserId = Meteor.users.findOne(this.userId)._id;
		if(!theUserId){
			return;
		}

		var theUserPro = Profile.findOne({ownerId: theUserId});
		var note = Notification.findOne({_id: noteID});
		var parpage = Pages.findOne({_id: note.pageOwner});
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

		var type = dande.typeDE;
		var page = Pages.findOne({_id: dande.forPage});
		Pages.update(page._id, {$push:{
			whoDealsMonthly: note.holdUser
		}});
		Pages.update(page._id, {$set:{
			monthlyTransactions: page.monthlyTransactions + 1
		}});
		DandE.update(note.perid, {$set:{
			timesUsed: dande.timesUsed + 1
		}})
		DandE.update(note.perid, {$push: {
			usedBy: note.holdUser
		}})

		TomBook.update(book._id, {$pull: {
			tbc: {theID: note.perid}
		}})

		//done with actions
		//Check if the user hit the mark needed to get money

		function countInArray(array, what) {
		    return array.filter(item => item == what).length;
		}
		var cust = note.holdUser;

		var custInArray = page.requiredForGoal;
		var CIACount = countInArray(page.whoDealsMonthly, cust);
		var giftAmount = page.moneyForGoal;

		console.log(custInArray, CIACount+1)
		if(custInArray <= (CIACount+1)){
			console.log('yay');
			Pages.update(page._id, {$pull:{
				whoDealsMonthly: cust
			}});
			var custProfile = Profile.findOne({ownerId: cust});
			var existingCard = GiftCards.findOne({pageID: page._id, ownerId: cust});
			if(existingCard){
				console.log('previous')
				var tempAmount = existingCard.amount + giftAmount
				GiftCards.update(existingCard._id, {$set: {
					amount: tempAmount
				}});
			}
			else{
				console.log('new')
				
				GiftCards.insert({
					pageID: page._id,
					ownerId: cust,
					where: page.orgName,
					amount: giftAmount,
					userName: custProfile.name,
					createdAt: new Date(),
				});
			}
			var umes = "You reached "+page.requiredForGoal.toString()+" deals! "+ page.orgName+" has rewarded you with a $"+page.moneyForGoal.toFixed(2).toString()+" gift card!";
			Notification.insert({
				ownerId: note.holdUser,
				pageOwner: note.holdUser,
				message: umes,
				type: dande.type,
				createdAt: new Date(),
			});
			var busmo = "Your customer, "+custProfile.name+", has reached "+page.requiredForGoal.toString()+" deals and has been paid $"+page.moneyForGoal.toFixed(2).toString()+" as a reward.";
			Notification.insert({
				ownerId: page.ownedBy[0],
				pageOwner: page._id,
				message: busmo,
				type: "GC",
				createdAt: new Date(),
			});
		}

		//Now to alert folks
		var umes = dande.forPageName+" has accepted the transaction for "+dande.title+".";
		Notification.insert({
			ownerId: note.holdUser,
			pageOwner: note.holdUser,
			message: umes,
			type: dande.type,
			createdAt: new Date(),
		});

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

		var allSameNotes = Notification.find({holdUser: note.holdUser, perid: note.perid}).fetch();
		console.log(allSameNotes.length, note.perid, note.holdUser)
		for(var i = 0; i<allSameNotes.length; i++){
			Notification.remove(allSameNotes[i]._id);
		}
		
	}
});