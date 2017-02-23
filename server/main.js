import { Meteor } from 'meteor/meteor';
import { Profile } from '../imports/collections/profile';
import { Pages } from '../imports/collections/pages';
import {DandE} from '../imports/collections/dande';
import {TomBook} from '../imports/collections/tombook';
import {GiftCards} from '../imports/collections/giftcards';
import {Notification} from '../imports/collections/notification';
import moment from 'moment';

Meteor.startup(() => {
	
	var stripe = StripeAPI(Meteor.settings.StripePri);
	console.log('Server Online')
	var d = new Date();
	var n = d.getMinutes();
	var lastExpi = moment(d).add(-1,'day').format("ll");
	var lastExpi;
	var endDate = moment(new Date()).endOf('month').format("ll");
	console.log(endDate)
	console.log(lastExpi);

	Meteor.setInterval(function() {
		//START of daily deal expiration check.
		
	    var d = new Date();
		var n = d.getMinutes();
		var newExpi = moment(d).format("ll");
		endDate = moment(new Date()).endOf('month').format("ll");
		console.log(newExpi, endDate)
		if(newExpi!=lastExpi){
			lastExpi = newExpi;
			//new day

			console.log("Conducting Daily Check");
			//reseting dailing deal allowance
			Profile.update(
			   {},
			   {
			     $set: {todayDeals: 0}
			   }, 
			   { multi: true }
			)

			var allDandEs = DandE.find({expiration: newExpi}).fetch();
			for(var i =0;i<allDandEs.length;i++){
				DandE.update(allDandEs[i]._id, {$set:{dealsOn: false}});
				var message = "Your deal - '"+allDandEs[i].title+"' - has reached its expiration date and expired.";
				Notification.insert({
					ownerId: allDandEs[i].topUser,
					pageOwner: allDandEs[i].forPage,
					message: message,
					type: "DD",
					createdAt: new Date(),
				});
			}
			console.log(allDandEs.length, "deals went offline today.")
			//END of daily deal expiration check.
			//START of daily membership checks
			console.log("Conducting daily membership checks");
			var d = new Date();
			//GOTTA CHANGE THIS HERE SO THE EXPIRATION IS TODAYS DATE OTHERWISE IT ALWAYS RUNS//DOWN A FEW LINES*****8
			var iToday = moment(d).format("ll");
			var expiration = moment(d).add(1,'month').format("ll");
			//Start check if moon member expiring
			var stripe = StripeAPI(Meteor.settings.StripePri);
			var moonMembers = Profile.find({memberAllowance: 5, moonDate: iToday}).fetch();
			console.log('moon lenght', moonMembers.length)
			for(var x =0; x< moonMembers.length; x++){
				var fupa = moonMembers[x];
				if(moonMembers[x].stripeCust){
					stripe.charges.create({ 
				        amount: 500,
				        currency: "usd",
				        customer: moonMembers[x].stripeCust,
				        description: "Moon Membership Monthly"
				      	}, Meteor.bindEnvironment(function(error, result){
				        if(error){
				        	console.log(error)
				        	Profile.update(fupa._id, {$set:{memberAllowance: 1}});
				        }else{
							
							var message = "You have been charged $5.00 for renewing Moon Membership. Thanks for supporting Unight!";
							var type = "GCD";

							Notification.insert({
								ownerId: fupa.ownerId,
								pageOwner: fupa.ownerId,
								message: message,
								type: type,
								createdAt: new Date(),
								
							});
							Profile.update(fupa._id,{$set: {moonDate: expiration}});
				        }
				    }));
				}
				else{
					var message = "You have not been charged for $5.00 this month. Moon Membership has been cancelled.";
					var type = "GCD";

					Notification.insert({
						ownerId: fupa.ownerId,
						pageOwner: fupa.ownerId,
						message: message,
						type: type,
						createdAt: new Date(),
						
					});
				}
				
			}

			//END moon checks
			//START of monthly transactions --newexpi == endDate-- 
			//checking to see if today is the end of the month.
			//if it is, charge the businesses the amount due
			//endDate
			if(newExpi == endDate){
				console.log('running monthlyTransactions');
				var allBusIDs = Profile.find({businessVerified: true}).fetch();
				console.log(allBusIDs.length);
				for(var i = 0; i<allBusIDs.length; i++){
					console.log('looping')
					var loopUser = allBusIDs[i].ownerId;
					var allLoopUserPages = Pages.find({ownedBy: {$elemMatch: {$eq: loopUser}}}).fetch();
					var totalNumTrans = 0;
					var thisNumTrans = 0;
					for(var j = 0; j<allLoopUserPages.length; j++){
						thisNumTrans = allLoopUserPages[j].monthlyTransactions;
						totalNumTrans = totalNumTrans + thisNumTrans;
					}
					console.log(totalNumTrans);
					var samount;
					if(totalNumTrans < 11){
						samount = totalNumTrans * .5;
					}
					else if(totalNumTrans < 21){
						samount = ((totalNumTrans-10)*.4)+(10*.5);
					}
					else if(totalNumTrans < 31){
						samount = ((totalNumTrans - 20)* .3)+(10*.5)+(10*.4);
					}
					else{
						samount = ((totalNumTrans-30)*.25)+(10*.5)+(10*.4)+(10*.3);
					}
					samount = samount * 100;
					console.log(samount);
					var stripe = StripeAPI(Meteor.settings.StripePri);
					if(samount > 500){
						stripe.charges.create({ 
					        amount: samount,
					        currency: "usd",
					        customer: allBusIDs[i].stripeBusCust,
					        description: "Charged business for monthly transactions."
					      	}, Meteor.bindEnvironment(function(error, result){
					        if(error){
					        	console.log(error)
					        }else{
					        	console.log('charged')
					        	
					        }
					    }));
					}
					for(var j = 0; j<allLoopUserPages.length; j++){
						console.log('setting 0')
						var message = "You have been charged $"+(samount/100).toString()+" across all organization pages for your " +totalNumTrans.toString() + " accepted deals this month.";
						var type = "GCD";

						Notification.insert({
							ownerId: allLoopUserPages[j].ownedBy[0],
							pageOwner: allLoopUserPages[j]._id,
							message: message,
							type: type,
							createdAt: new Date(),
							
						});
						
					}
					
				}//
				Pages.update(
				   {published: true},
				   {
				     $set: {monthlyTransactions: 0}
				   }, 
				   { multi: true }
				)
				console.log('completed loops')
				//Starting monthly gold potentials
				console.log('starting gold potentials monthly')

				//end of the month, which users are eligible for gold?
				//return of a,b,c
				//a is list of originals
				//b is list of counts by original
				//c is list of originals that surpassed threshold

				function checkGoldees(arr, topper) {
				    var a = [], b = [],c=[], prev;
				    
				    for ( var i = 0; i < arr.length; i++ ) {
				        if ( arr[i] !== prev ) {
				            a.push(arr[i]);
				            b.push(1);
				        } else {
				            b[b.length-1]++;
				        }
				        prev = arr[i];
				    }
				    for(var j = 0; j < b.length;j++){
				    	if(b[j]>(topper-1)){
				      		c.push(a[j])
				      }
				    }
				    return [a, b, c];
				}

				
				
				console.log('ending gold potentials monthly');
				//Ending monthly gold potentials
				console.log("completed monthlyTransactions");
			}
			
			
			//END of Monthly transactions
		}
		
	}, 300000);
	//lets go every 5 mins ==== 5*60*1000 = 300,000

	//6 hours times 60 minutes times 60 seconds times 1000 = 21,600,000


	Meteor.publish('profile', function(){
		return Profile.find({ ownerId: this.userId });
	});
	Meteor.publish('pages', function(){
		var user = this.userId.toString();
		if(!user){
			return;
		}
		return Pages.find({
			ownedBy: {$elemMatch: {$eq: user}}
		})
	});
	Meteor.publish('onePage', function(pageID){
		var user = this.userId.toString();
		if(!user){
			return;
		}
		//add published:true
		return Pages.findOne({
			_id: pageID
		})
	});
	Meteor.publish('arrayPage', function(){
		var user = this.userId.toString();
		if(!user){
			return;
		}
		//add published:true
		var profile = Profile.findOne({ownerId: user});
		var pageArray = profile.goldMember;

		return Pages.find({
			_id:{$in: pageArray}
		}).fetch();
	});
	Meteor.publish('allPages', function(mobLL, range){
		var user = this.userId.toString();
		if(!user){
			return;
		}
		if(Array.isArray(mobLL)){
			var longlat = mobLL
		}
		else{
			var profile = Profile.findOne({ownerId: user});
			var longlat = [profile.longlat0,profile.longlat1];
		}

		if(range){
			if(range > .2 || range < .05){
				return;
			}
		}
		else{
			var range = .1;
		}
		//add published:true
		return Pages.find({ longlat0: {$gt: (longlat[0]-range), $lt: (longlat[0]+range)}, longlat1: {$gt: (longlat[1]-range), $lt: (longlat[1]+range)}})
	});

	Meteor.publish('memOrgPage', function(pageID){
		var user = this.userId.toString();
		if(!user){
			return;
		}

		return Pages.findOne({_id: pageID})
	});
	Meteor.publish('orgGeneralDeals', function(){
		var user = this.userId.toString();
		if(!user){
			return;
		}
		
		return DandE.find({
			topUser: user,
			typeDE: "DD"
		})
	});
	Meteor.publish('orgSilverDeals', function(){
		var user = this.userId.toString();
		if(!user){
			return;
		}
		
		return DandE.find({
			topUser: user,
			typeDE: "SD"
		})
	});
	Meteor.publish('orgGoldDeals', function(){
		var user = this.userId.toString();
		if(!user){
			return;
		}
		
		return DandE.find({
			topUser: user,
			typeDE: "GD"
		})
	});
	Meteor.publish('events', function(){
		var user = this.userId.toString();
		if(!user){
			return;
		}
		
		return DandE.find({
			topUser: user,
			typeDE: "E"

		})
	});
	Meteor.publish('wgot', function(mobLL, range){
		var user = this.userId.toString();
		if(!user){
			return;
		}
		if(Array.isArray(mobLL)){
			var longlat = mobLL;
		}
		else{
			var profile = Profile.findOne({ownerId: user});
			var longlat = [profile.longlat0,profile.longlat1];
		}

		if(range){
			if(range > .2 || range < .05){
				return;
			}
		}
		else{
			var range = .1;
		}
		var pages = Pages.find({ longlat0: {$gt: (longlat[0]-range), $lt: (longlat[0]+range)}, longlat1: {$gt: (longlat[1]-range), $lt: (longlat[1]+range)}}).fetch();
		var pageIDs = [];
		for(var i = 0; i < pages.length;i++){
			pageIDs.push(pages[i]._id);
		}
		return DandE.find({dealsOn: true, forPage: {$in: pageIDs}}, { sort: {upvotes: -1}})
	});
	Meteor.publish('singleWgot', function(single){
		var user = this.userId.toString();
		if(!user){
			return;
		}
		return DandE.find({dealsOn: true, _id: single})
	});
	Meteor.publish('tombook', function(){
		var user = this.userId.toString();
		if(!user){
			return;
		}
		
		return TomBook.find({
			topUser: user
		})
	});
	Meteor.publish('tblist', function(tbcb){
		var user = this.userId.toString();
		if(!user){
			return;
		}

		return DandE.find({_id: {$in:tbcb}})
		//return [Events.find({_id: {$in:tbce}}),GoldDeals.find({_id: {$in:tbcg}}),SilverDeals.find({_id: {$in:tbcs}}),GeneralDeals.find({_id: {$in:tbcd}})]
	});
	Meteor.publish('tbMember', function(){
		var user = this.userId.toString();
		if(!user){
			return;
		}
		const profile = Profile.findOne({
			ownerId: user
		})

		return Pages.find({_id: {$in: profile.goldMember}})
	});
	Meteor.publish('pageDeals', function(pageID){
		var user = this.userId.toString();
		if(!user){
			return;
		}
		return DandE.find({forPage: pageID, dealsOn: true})
	});
	Meteor.publish('userCards', function(){
		var user = this.userId.toString();
		if(!user){
			return;
		}
		return GiftCards.find({ownerId: user})
	});
	Meteor.publish('adminCards', function(pageID){
		var user = this.userId.toString();
		if(!user){
			return;
		}
		var page = Pages.findOne({_id: pageID});
		if(page.ownedBy[0] != user){
			return;
		}
		return GiftCards.find({pageID: pageID})
	});
	Meteor.publish('notifications', function(){
		var user = this.userId.toString();
		if(!user){
			return;
		}

		return Notification.find({ownerId: user});
	});
	Meteor.publish('memnotes', function(){
		var user = this.userId.toString();
		if(!user){
			return;
		}

		return Notification.find({ownerId: user, pageOwner: user});
	});
	Meteor.publish('altnotes', function(){
		console.log('here')
		var user = this.userId.toString();
		if(!user){
			return;
		}
		var profile = Profile.findOne({ownerId: user});
		var page = Pages.findOne({_id: profile.altnotes})

		var found = false;
		for(var i = 0; i<page.altnotes.length;i++){

			if(page.altnotes[i].email == profile.email){
				found = true;
			}
		}
		if(!found){

			return;
		}

		return Notification.find({pageOwner: page._id});
	});
	
	Meteor.publish("altnotesPage", function(){
		var user = this.userId.toString();
		if(!user){
			return;
		}
		var profile = Profile.findOne({ownerId: user});
		var page = Pages.findOne({_id: profile.altnotes})

		var found = false;
		for(var i = 0; i<page.altnotes.length;i++){

			if(page.altnotes[i].email == profile.email){
				found = true;
			}
		}
		if(!found){

			return;
		}

		return Pages.find({_id: profile.altnotes});
	});
});
