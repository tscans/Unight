import { Meteor } from 'meteor/meteor';
import { Profile } from '../imports/collections/profile';
import { Pages } from '../imports/collections/pages';
import {DandE} from '../imports/collections/dande';
import {TomBook} from '../imports/collections/tombook';
import {GiftCards} from '../imports/collections/giftcards';
import {Notification} from '../imports/collections/notification';
import moment from 'moment';

var forTheHtml = '<div style="text-align:center; font-family: Arial, Helvetica, sans-serif">'+
'<img src="http://i.imgur.com/urR5bHp.png" height="200px" />'+
'<h1>Welcome to Unight!</h1>'+
'<p>We hope you enjoy great deals! Click <a href="http://unight.io/loginuser#">here</a> to sign in as a user. </p>'+
'<p>Or if you are a business owner, feel free to <a href="http://unight.io/loginorg#">create a page</a> and try out our services.</p>'+
'<p>Dont forget to go mobile with our app! Available on iOS and Android.</p>'+
'</div>';

Meteor.startup(() => {
	process.env.MAIL_URL = "smtp://postmaster%40mail.unight.io:foxtrotac39a!@@smtp.mailgun.org:587";

	// for(var i = 0;i<6;i++){
	// 	Email.send({
	// 	  to: "tystanish@gmail.com",
	// 	  from: "UnightMail@mail.unight.io",
	// 	  subject: "Welcome Noob",
	// 	  html: forTheHtml,
	// 	});
	// }
});
Meteor.methods({
	'mail.sendMail': function(usid){
		return TomBook.insert({
			topUser: usid,
			tbc: []
		});
	},
})
