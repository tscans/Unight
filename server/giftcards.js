import {GiftCards} from '../imports/collections/giftcards';
import {Profile} from '../imports/collections/profile';
import {Pages} from '../imports/collections/pages';
import {Notification} from '../imports/collections/notification';

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

function emailBody(whose, usid, code, buyer, business, amountCredit){
	var unsub = `http://Udeal.meteorapp.com/verify/email/`+usid+`/`+code+`/loginuser`;
	var direction;
	if(whose == "self"){
		direction = `<p>You purchased a Gift Card for `+business+` worth $`+amountCredit+`.</p>`
	}
	if(whose == "other"){
		direction = `<p>User `+buyer+` purchased a Gift Card for you at `+business+` worth $`+amountCredit+`.</p>`
	}
	return `<!DOCTYPE html>
<html>
<head>
<style>
  .bg-2 {
      background-color: #522256;
      background-image: -webkit-linear-gradient(30deg, rgba(100, 205, 244,1) 65%, #682c6d 65%);
      background-color: #522256;
      color: #ffffff;
  }
  .bump-top{
    margin-top: 50px;
  }
  .bump-bot{
  	margin-bottom:150px;
  }
</style>
</head>
<body class="bg-2">
<div style='text-align:center; font-family: Arial, Helvetica, sans-serif; font-size:20px; color: white;'>
<a href="http://Udeal.meteorapp.com"><img src='http://i.imgur.com/vXs2ksV.png' height='200px' class="bump-top"/></a>
<h2>You are the owner of a Udeal Gift Card</h2>
`+direction+`
<p>Be sure to visit `+business+` more often to use your gift card. Thanks for choosing Udeal to be a loyal customer!</p>
<div class="bump-top bump-bot">
<p>Udeal.io</p>
</div>
<p>If you wish to unsubscribe from future Udeal emails click this <a href="`+unsub+`">link.</a></p>
</div>
</body>
</html>`;
}

Meteor.methods({
	'giftcards.addGiftCard': function(theUserId, pageID, amountToken, friend){
		var user = this.userId.toString();
		if (user != theUserId){
			return;
		}
		if(!(checker(pageID, "string") && checker(amountToken, "number") && checker(friend, "string"))){
	    	console.log('hacker')
	    	return;
	    }
	    if(!(ulength(pageID, 20) && ulength(friend, 50))){
	    	return;
	    }
		const profile = Profile.findOne({
			ownerId: user
		});
		if(profile.deactivate == true){
			throw new Meteor.Error(530, 'Your purchase abilities are deactivated.');
			return;
		}
		const pages = Pages.findOne({
			_id: pageID
		})
		var pageStripeActData = Profile.findOne({
			ownerId: pages.ownedBy[0]
		})
		pageStripeActData = pageStripeActData.stripeBusiness;
		var ourCharge;

		if(amountToken == 0){
			giftAmount = 10.00
			ourCharge = .07
		}
		if(amountToken == 1){
			giftAmount = 20.00
			ourCharge = .06
		}
		if(amountToken == 2){
			giftAmount = 50.00
			ourCharge = .05
		}
		if(amountToken == 3){
			giftAmount = 100.00
			ourCharge = .04
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
			throw new Meteor.Error(540, "No Credit Card on Account");
			return;
		}
		var appfee = samount*ourCharge
		var theirCharge = (samount*.029)+30;
		var custExpense = appfee-theirCharge;
		if(custExpense<0){
			custExpense = custExpense*-1;
		}
		console.log(custExpense, appfee, theirCharge)

		var stripeCall = stripe.charges.create({
	        amount: samount,
	        currency: "usd",
	        customer: profile.stripeCust,
	        description: "purchased a gift card",
	        application_fee: custExpense,
	        destination: pageStripeActData
	      	}, Meteor.bindEnvironment(function(error, result){
	        if(error){
	        	console.log(error)
	          	throw "error";
	          return;
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
			var stringAmount = giftAmount.toFixed(2).toString();
			if(inFriendsList.subscribeEmail){
				if(inFriendsList !=profile){
					Email.send({
					  to: inFriendsList.email,
					  from: "UdealMail@mail.Udeal.io",
					  subject: "You've Got Gift Card!",
					  html: emailBody('other',profile.ownerId,profile.code, profile.name, pages.orgName, stringAmount),
					});
				}
				else{
					Email.send({
					  to: profile.email,
					  from: "UdealMail@mail.Udeal.io",
					  subject: "You've Got Gift Card!",
					  html: emailBody('self',profile.ownerId,profile.code, profile.name, pages.orgName, stringAmount),
					});
				}
			}
			
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
		if(!(checker(cardID, "string") && checker(amountDebit, "number"))){
	    	console.log('hacker')
	    	return;
	    }
	    if(!(ulength(cardID, 20))){
	    	return;
	    }
		if(isNaN(amountDebit)){
			throw new Meteor.Error(520, 'User did not enter a valid number.');
	    	console.log(amountDebit)
			return;
		}
		const profile = Profile.findOne({
			ownerId: user
		});
		var existingCard = GiftCards.findOne({_id: cardID});
		if(!existingCard){
			throw new Meteor.Error(520, 'Could not find a vaild card.');
			return;
		}

		if(!existingCard.ownerId == user){
			throw new Meteor.Error(520, 'User is not the owner of this gift card.');
			return;
		}
		amountDebit = parseFloat(amountDebit);
	    amountDebit = amountDebit.toFixed(2);
	    if(isNaN(amountDebit)){
	    	console.log(amountDebit)
			return;
		}
		amountDebit = parseFloat(amountDebit);
		var tempCurrent = existingCard.amount.toFixed(2);
		tempCurrent = parseFloat(tempCurrent);

		if(amountDebit>tempCurrent){
			throw new Meteor.Error(520, 'Too much withdrawn. Please purchase more credit for this business.');
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



