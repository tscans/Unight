import {GiftCards} from '../imports/collections/giftcards';
import {Profile} from '../imports/collections/profile';
import {Pages} from '../imports/collections/pages';
import {Notification} from '../imports/collections/notification';

Meteor.methods({
	'giftcards.addGiftCard': function(theUserId, pageID, amountToken){
		var user = this.userId.toString();
		if (user != theUserId){
			return;
		}
		const profile = Profile.findOne({
			ownerId: user
		});
		const pages = Pages.findOne({
			_id: pageID
		})
		if(amountToken == 0){
			giftAmount = 10.00
		}
		if(amountToken == 1){
			giftAmount = 20.00
		}
		if(amountToken == 2){
			giftAmount = 50.00
		}
		if(amountToken == 3){
			giftAmount = 100.00
		}
		var individual = profile.name;
		var message = "User, "+individual+", has just purchased a $"+giftAmount.toString()+ " gift card for your organization.";
		var type = "GC";

		Notification.insert({
			ownerId: pages.ownedBy[0],
			pageOwner: pages._id,
			message: message,
			type: type,
			createdAt: new Date(),
			
		});
		var existingCard = GiftCards.findOne({pageID: pageID, ownerId: user});
		if(existingCard){
			var tempAmount = existingCard.amount + giftAmount
			return GiftCards.update(existingCard._id, {$set: {
				amount: tempAmount
			}});
		}
		else{
			return GiftCards.insert({
				pageID: pageID,
				ownerId: user,
				where: pages.orgName,
				amount: giftAmount,
				userName: profile.name,
				createdAt: new Date(),
			});
		}
	},
	'giftcards.subtractCredit': function(theUserId, cardID, amountDebit){
		var user = this.userId.toString();
		if (user != theUserId){
			return;
		}

		const profile = Profile.findOne({
			ownerId: user
		});
		var existingCard = GiftCards.findOne({_id: cardID});
		if(!existingCard){
			return;
		}

		if(!existingCard.ownerId == user){
			return;
		}
		amountDebit = parseFloat(amountDebit);
	    amountDebit = amountDebit.toFixed(2);
	    if(amountDebit == NaN){
			return;
		}
		amountDebit = parseFloat(amountDebit);
		var tempCurrent = existingCard.amount.toFixed(2);
		tempCurrent = parseFloat(tempCurrent);

		if(amountDebit>tempCurrent){
			console.log('too much withdrawn');
			return;
		}
		var page = Pages.findOne({_id: existingCard.pageID});
		if(amountDebit == tempCurrent){
			return GiftCards.remove(cardID);
		}
		var individual = profile.name;
		var message = "User, "+individual+", has just spent $"+amountDebit.toString()+ " of their gift card for your organization.";
		var type = "GCD";

		Notification.insert({
			ownerId: page.ownedBy[0],
			pageOwner: page._id,
			message: message,
			type: type,
			createdAt: new Date(),
			
		});
		var newAmount = tempCurrent - amountDebit;
		return GiftCards.update(existingCard._id, {$set: {
			amount: newAmount
		}});
	}
});



