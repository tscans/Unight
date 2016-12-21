import {GiftCards} from '../imports/collections/giftcards';
import {Profile} from '../imports/collections/profile';
import {Pages} from '../imports/collections/pages';

Meteor.methods({
	'giftcards.addGiftCard': function(theUserId, pageID, amountToken){
		console.log('gift card added')
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
		var existingCard = GiftCards.findOne({pageID: pageID, ownerId: user});
		console.log(existingCard);
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
				userName: profile.name
			});
		}
	}
});