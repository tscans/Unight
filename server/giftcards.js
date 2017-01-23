import {GiftCards} from '../imports/collections/giftcards';
import {Profile} from '../imports/collections/profile';
import {Pages} from '../imports/collections/pages';
import {Notification} from '../imports/collections/notification';

Meteor.methods({
	'giftcards.addGiftCard': function(theUserId, pageID, amountToken, friend){
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
		var pageStripeActData = Profile.findOne({
			ownerId: pages.ownedBy[0]
		})
		pageStripeActData = pageStripeActData.stripeBusiness;
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
		var inFriendsList = null;
		function containsObject(obj, list) {
		    var i;
		    for (i = 0; i < list.length; i++) {
		        if (list[i].number == obj.number) {
		            return true;
		        }
		    }

		    return false;
		} 
		if(friend){
			console.log(profile.friendUsers)
			console.log(friend)
			console.log(containsObject(friend,profile.friendUsers))
			if(!(containsObject(friend,profile.friendUsers))){
				console.log('potential compromise')
				return;
			}
			else{
				inFriendsList = Profile.findOne({email: friend.number})
				if(inFriendsList ==null){
					console.log(inFriendsList)
					console.log('user dne')
					return
				}
			}
		}
		if(inFriendsList == null){
			console.log('no user')
			inFriendsList = profile
		}
		var stripe = StripeAPI(Meteor.settings.StripePri);
		var samount = giftAmount * 100;
		if(!profile.stripeCust){
			return;
		}
		var appfee = samount*.1

		stripe.charges.create({
	        amount: samount,
	        currency: "usd",
	        customer: profile.stripeCust,
	        description: "purchased a gift card",
	        application_fee: appfee,
	        destination: pageStripeActData
	      	}, Meteor.bindEnvironment(function(error, result){
	        if(error){
	        	console.log(error)
	          throw new Meteor.error(500, "stripe-error", error.message);
	        }else{
	        var individual = profile.name;
			var message = "User, "+individual+", has just purchased a $"+giftAmount.toString()+ " gift card at your organization for the user "+inFriendsList.name+".";
			var type = "GC";

			Notification.insert({
				ownerId: pages.ownedBy[0],
				pageOwner: pages._id,
				message: message,
				type: type,
				createdAt: new Date(),
				
			});
	          console.log('successful charge and notification');
	          var existingCard = GiftCards.findOne({pageID: pageID, ownerId: inFriendsList.ownerId});
				if(existingCard){
					var tempAmount = existingCard.amount + giftAmount
					return GiftCards.update(existingCard._id, {$set: {
						amount: tempAmount
					}});
				}
				else{
					return GiftCards.insert({
						pageID: pageID,
						ownerId: inFriendsList.ownerId,
						where: pages.orgName,
						amount: giftAmount,
						userName: inFriendsList.name,
						createdAt: new Date(),
					});
				}
	          return result;
	        }
	    }))
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
		if(amountDebit == tempCurrent){
			return GiftCards.remove(cardID);
		}
		var newAmount = tempCurrent - amountDebit;
		return GiftCards.update(existingCard._id, {$set: {
			amount: newAmount
		}});
	}
});



