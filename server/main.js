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
			console.log("Conducting Daily Check");
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
			var allProfiles = Profile.find({goldMemberChecks: {$elemMatch: {expiration: expiration}}}).fetch();
			console.log(allProfiles.length)
			for(var f = 0; f<allProfiles.length; f++){
				var u = allProfiles[f].goldMemberChecks;
				for(var c = 0; c<u.length;c++){
					console.log(u[c].expiration,iToday)
					//is the expiration on this membership == to today?
					console.log(u[c].expiration == iToday)
					if(u[c].expiration == iToday){
						if(u[c].paid){
							if(u[c].continuity){
								//start
								var stripe = StripeAPI(Meteor.settings.StripePri);
								var page = Pages.findOne({_id:u[c].pageID});
								var adminProfile = Profile.findOne({ownerId: page.ownedBy[0]});
								pageStripeActData = adminProfile.stripeBusiness;
								stripe.charges.create({
							        amount: u[c].amount,
							        currency: "usd",
							        customer: allProfiles[f].stripeCust,
							        description: "monthly gold payment",
							        destination: pageStripeActData
							      	}, Meteor.bindEnvironment(function(error, result){
							        if(error){
							        	console.log(error);
							        }
							        else{

							          console.log('successful charge and notification');
							          
							        }
							    }))
								//end
								var page = Pages.findOne({_id:u[c].pageID});

						        var individual = allProfiles[f].name;
								var message = "User, "+individual+", has just renewed membership at your organization.";
								var type = "GM";

								Notification.insert({
									ownerId: page.ownedBy[0],
									pageOwner: page._id,
									message: message,
									type: type,
									createdAt: new Date(),
									
								});
								var d = new Date();
								var expiration = moment(d).add(1,'month').format("ll");
								
								Profile.update(allProfiles[f]._id, {$pull: {
									goldMember: page._id,
									goldMemberChecks: {pageID: page._id}
								}})
								Profile.update(allProfiles[f]._id, {$push: {
									goldMember: page._id,
									goldMemberChecks: {pageID: page._id, expiration: expiration, paid: true, continuity: true, amount: 500, orgName: page.orgName, proPict: page.proPict}
								}})
								
							} 
							else{
								console.log('no longer member')
								Pages.update(u[c].pageID, {$pull: {
									pageUsers: allProfiles[f].ownerId
								}})
								Profile.update(allProfiles[f]._id, {$pull: {
									goldMember: u[c].pageID,
									goldMemberChecks: {pageID: u[c].pageID}
								}})
							}
						}
						else{
							console.log('no longer member')
							Pages.update(u[c].pageID, {$pull: {
								pageUsers: allProfiles[f].ownerId
							}})
							Profile.update(allProfiles[f]._id, {$pull: {
								goldMember: u[c].pageID,
								goldMemberChecks: {pageID: u[c].pageID}
							}})
						}
					}
				}
			}

			//END of daily membership checks
			//START of monthly transactions --newexpi == endDate-- 
			//checking to see if today is the end of the month.
			//if it is, charge the businesses the amount due
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
					        	console.log("Successful charge to business.")
								
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
									Pages.update(allLoopUserPages[j]._id, {$set:{monthlyTransactions: 0}});
								}
					        }
					    }));
					}
				}
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

				var allDealPages = Pages.find({hasDeals: true}).fetch();
				if(!allDealPages){

				}
				else{
					for(var z = 0; z<allDealPages.length;z++){
						if(!allDealPages[z].requiredForGold){
							return;
						}
						var newGoldsTri = checkGoldees(allDealPages[z].whoDealsMonthly, allDealPages[z].requiredForGold);
						var pageID = allDealPages[z]._id;
						var newGold = newGoldsTri[2];
						for(var a = 0; a<newGold.length;a++){
							var profileID = Profile.findOne({
								ownerId: newGold[a]
							})
							Pages.update(pageID, {$pull: {
								pageUsers: newGold[a]
							}})
							Pages.update(pageID, {$push: {
								pageUsers: newGold[a]
							}})
							var individual = profileID.name;
							var message = "User, "+individual+", has just become a member of your organization after using "+newGoldsTri[1][a]+" deals this past month.";
							var type = "GM";

							Notification.insert({
								ownerId: allDealPages[z].ownedBy[0],
								pageOwner: pageID,
								message: message,
								type: type,
								createdAt: new Date(),
								
							});
							var d = new Date();
							var expiration = moment(d).add(1,'month').format("ll");
							Profile.update(profileID._id, {$pull: {
								goldMember: pageID,
								goldMemberChecks: {pageID: pageID}
							}})
							Profile.update(profileID._id, {$push: {
								goldMember: pageID,
								goldMemberChecks: {pageID: pageID, expiration: expiration, paid: false, continuity: false, amount: 500}
							}})
						}
						Pages.update(pageID, {$set:{
							whoDealsMonthly: []
						}})
					}
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
		return DandE.find({dealsOn: true, longlat0: {$gt: (longlat[0]-range), $lt: (longlat[0]+range)}, longlat1: {$gt: (longlat[1]-range), $lt: (longlat[1]+range)}}, { sort: {upvotes: -1}})
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
	Meteor.publish('altnotes', function(){
		console.log('here')
		var user = this.userId.toString();
		if(!user){
			return;
		}
		var profile = Profile.findOne({ownerId: user});
		var page = Pages.findOne({_id: profile.altnotes})
		if(page.altnotes.indexOf(user) == -1){
			console.log('not there')
			return;
		}

		return Notification.find({pageOwner: page._id});
	});
});
