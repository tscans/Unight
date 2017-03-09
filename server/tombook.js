import {TomBook} from '../imports/collections/tombook';
import {Pages} from '../imports/collections/pages';
import {DandE} from '../imports/collections/dande';
import {Profile} from '../imports/collections/profile';
import {Notification} from '../imports/collections/notification';

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
		if(!cont){
			return;
		}
		console.log(type);
		if(dande.usedBy.indexOf(theUserId) != -1){
			console.log('Not a membereee.')
			throw new Meteor.Error(509, "This user already used this deal.");
		}
		if(dande.typeDE=="GD"){
			//charge em
			//otherwise 
			if(!userProfile.stripeCust){
				throw new Meteor.Error(501, "No credit card on account.");
				return;
			}
			var page = Pages.findOne({_id: dande.forPage});
			var amount = parseInt(dande.cost *100);
			var custExpense = parseInt(amount*.1);
			var stripe = StripeAPI(Meteor.settings.StripePri);

			var pageOwnerProfile = Profile.findOne({ownerId: page.ownedBy[0]});

			stripe.charges.create({
		        amount: amount,
		        currency: "usd",
		        customer: userProfile.stripeCust,
		        description: "purchased a ready deal on Udeal.",
		        application_fee: custExpense,
		        destination: pageOwnerProfile.stripeBusiness
		      	}, Meteor.bindEnvironment(function(error, result){
		        if(error){
		        	console.log(error)
		          	throw "error";
		          return;
		        }else{
					// if(profile.subscribeEmail){
					// 	Email.send({
					// 	  to: profile.email,
					// 	  from: "UdealMail@mail.Udeal.io",
					// 	  subject: "You've Got Gift Card!",
					// 	  html: emailBody('self',profile.ownerId,profile.code, profile.name, pages.orgName, '5'),
					// 	});
					// }
					var message = "You have purchased a deal at "+page.orgName+" for $"+dande.cost.toFixed(2).toString()+".";
					var type = "GC";
					Notification.insert({
						ownerId: theUserId,
						pageOwner: theUserId,
						message: message,
						type: type,
						createdAt: new Date(),
						
					});
					TomBook.update(book._id, {$push: {
						tbc: {
							theID: deid,
							theType: type,
							createdAt: new Date(),
							paid: true
						}
						
					}})
				
			        console.log('successful charge and email notification');
		        }
		    }))
			
		}
		else{
			TomBook.update(book._id, {$push: {
				tbc: {
					theID: deid,
					theType: type,
					createdAt: new Date(),
					paid: true
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