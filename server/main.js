import { Meteor } from 'meteor/meteor';
import { Profile } from '../imports/collections/profile';
import { Pages } from '../imports/collections/pages';
import {DandE} from '../imports/collections/dande';
import {TomBook} from '../imports/collections/tombook';

Meteor.startup(() => {
	var stripe = StripeAPI(Meteor.settings.StripePri);

	Meteor.methods({
		"chargeCard": function(cardToken){
			stripe.charges.create({
				amount: 500,
				currency: "USD",
				source: cardToken
			}, function(error, result){
				if(error){
					throw new Meteor.error(500, "stripe", error.message);
				}
				else{
					console.log(result)
					return result;
				}
			})
		},
		"addCard":function(cardToken){
			const theUserId = Meteor.users.findOne(this.userId)._id;
			if(!theUserId){
				return;
			}
			const userPro = Profile.findOne({
				ownerId: theUserId
			})
			if(userPro.stripeCust == null){
				var custCreate = Async.runSync(function(done){
					stripe.customers.create({
						source: cardToken
					},function(error, response){
						done(error, response);
					})
				})
				if(custCreate.error){
					throw new Meteor.error(500, "Stripe-error", custCreate.error.message);
				}
				else{
					Profile.update(userPro._id, {$set: {stripeCust: custCreate.result.id}});
					return;
				}
			}else{
				var custUpdate = Async.runSync(function(done){
					stripe.customers.update(userPro.stripeCust, {
						source: cardToken
					}, function(error, result){
						console.log(error)
						done(error, result);
					})
				})
				if(custCreate.error){
					throw new Meteor.error(500, "Stripe-error", custUpdate.error.message);
				}
				else{
					return;
				}
			}
		}
	});

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
	Meteor.publish('allPages', function(){
		var user = this.userId.toString();
		console.log(user)
		if(!user){
			return;
		}

		return Pages.find({
		})
	});

	Meteor.publish('memOrgPage', function(){
		var user = this.userId.toString();
		if(!user){
			return;
		}
		
		return Pages.find({})
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
	Meteor.publish('wgot', function(per_page){
		var user = this.userId.toString();
		if(!user){
			return;
		}
		
		return DandE.find({}, { limit: per_page, sort: {upvotes: -1}})
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
});
