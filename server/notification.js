import {Notification} from '../imports/collections/notification';
import {Pages} from '../imports/collections/pages';
import {DandE} from '../imports/collections/dande';
import {Profile} from '../imports/collections/profile';

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
			count: count

		});
	},
	'notification.deleteNotification':function(noteID){
		const theUserId = Meteor.users.findOne(this.userId)._id;
		if(!theUserId){
			return;
		}
		var note = Notification.findOne({_id: noteID});
		console.log('note')
		if(note.ownerId != theUserId){
			return;
		}
		return Notification.remove(noteID);
	}
});