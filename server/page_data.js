import {Pages} from '../imports/collections/pages';
import {PageData} from '../imports/collections/page_data';
import {DandE} from '../imports/collections/dande';
import {Notification} from '../imports/collections/notification';
import {Profile} from '../imports/collections/profile';
import {GiftCards} from '../imports/collections/giftcards';
import moment from 'moment';

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
	'pagedata.createCode': function(){
		var user = this.userId.toString();
		if (!user){
			return;
		}
		const page = Pages.findOne({
			ownedBy: {$elemMatch: {$eq: user}}
		})
		var d = new Date();
		var n = d.getMinutes();
		var tomorrow = moment(d).add(1,'day').format("ll");
		var code = Math.floor(Math.random() * (9999 - 1111)) + 1111;
		PageData.insert({
			type: "code",
			expiration: tomorrow,
			pageID: page._id,
			code: code
		})
		return {code: code};
	},
	'pagedata.redeemCode': function(code, pageID){
		var user = this.userId.toString();
		if (!user){
			return;
		}
		var page = Pages.findOne({_id: pageID});
		if(!page){
			return;
		}
		var codeData = PageData.findOne({type: "code", pageID: pageID, code: code});
		if(!codeData){
			throw new Meteor.Error(570, 'Code not found.');
			return;
		}
		var profile = Profile.findOne({ownerId: user});
		if(!profile){
			return;
		}
		var RA = profile.rewards;
		var found = false;
		var currentCount = 0;
		for(var i = 0; i < RA.length; i++){
			if(pageID == RA[i].pageID){
				found = true;
				currentCount = RA[i].count;
			}
		}
		if(found){
			Profile.update(profile._id, {$pull: {rewards: {pageID: pageID}}});
			Profile.update(profile._id, {$push: {rewards: {pageID: pageID, count: (currentCount + 1), pageName: page.orgName, pageGoal: page.requiredForGoal}}});
			Notification.insert({
				ownerId: user,
				pageOwner: user,
				message: "Code redeemed for "+page.orgName+". "+(currentCount+1).toString()+" out of "+page.requiredForGoal.toString()+" needed for rewards.",
				type: "GC",
				createdAt: new Date(),
			});
		}
		else{
			Profile.update(profile._id, {$push: {rewards: {pageID: pageID, count: 1, pageName: page.orgName, pageGoal: page.requiredForGoal}}});
			Notification.insert({
				ownerId: user,
				pageOwner: user,
				message: "Code redeemed for "+page.orgName+".",
				type: "GC",
				createdAt: new Date(),
			});
		}
		//check if they got the reward. Give if they do.
		if((currentCount+1) >= page.requiredForGoal){
			Profile.update(profile._id, {$pull: {rewards: {pageID: pageID}}});
			Profile.update(profile._id, {$push: {rewards: {pageID: pageID, count: ((currentCount+1) - page.requiredForGoal), pageName: page.orgName, pageGoal: page.requiredForGoal}}});
			Notification.insert({
				ownerId: user,
				pageOwner: user,
				message: "Code redeemed for "+page.orgName+". You have reached the "+page.requiredForGoal.toString()+" rewards points needed for rewards. A gift card of $"+page.moneyForGoal.toFixed(2).toString()+" has been deposited into your UBook! Thanks for supporting "+page.orgName+".",
				type: "GC",
				createdAt: new Date(),
			});
			var existingCard = GiftCards.findOne({pageID: pageID, ownerId: user});
			if(existingCard){
				var tempAmount = existingCard.amount + page.moneyForGoal;
				tempAmount = tempAmount.toFixed(2);
				return GiftCards.update(existingCard._id, {$set: {
					amount: parseInt(tempAmount)
				}});
			}
			else{
				return GiftCards.insert({
					pageID: pageID,
					ownerId: user,
					where: page.orgName,
					amount: parseInt(page.moneyForGoal),
					userName: profile.name,
					createdAt: new Date(),
				});
			}
		}
		
		
		PageData.remove(codeData);
	}
});












