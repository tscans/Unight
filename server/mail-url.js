import { Meteor } from 'meteor/meteor';
import { Profile } from '../imports/collections/profile';
import { Pages } from '../imports/collections/pages';
import {DandE} from '../imports/collections/dande';
import {TomBook} from '../imports/collections/tombook';
import {GiftCards} from '../imports/collections/giftcards';
import {Notification} from '../imports/collections/notification';
import moment from 'moment';

function emailBody(usid,code){
	var user = `http://Udeal.meteorapp.com/verify/`+usid+`/`+code+`/loginuser`;
	var bus = `http://Udeal.meteorapp.com/verify/`+usid+`/`+code+`/loginorg`;
	return `<!DOCTYPE html>
<html>
<head>
<style>
  .bg-2 {
      background-color: #522256;
      background-image: -webkit-linear-gradient(30deg, #522256 65%, #682c6d 65%);
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
<img src='http://i.imgur.com/urR5bHp.png' height='200px' class="bump-top"/>
<h1>Welcome to Udeal!</h1>
<p>We hope you enjoy great deals! Click <a href="`+user+`">here</a> to verify your account and sign in as a user. </p>
<p>Or if you are a business owner, feel free to <a href="`+bus+`">create a page</a> and try out our services.</p>
<p>Don't forget to go mobile with our app! Available on iOS and Android.</p>
<div class="bump-bot">
Udeal.io
</div>
</div>
</body>
</html>`;
}

Meteor.startup(() => {
	process.env.MAIL_URL = SECRET;

	// for(var i = 0;i<1;i++){
	// 	Email.send({
	// 	  to: "tscanlan@mchs.org",
	// 	  from: "UdealMail@mail.Udeal.io",
	// 	  subject: "Welcome to Udeal",
	// 	  html: emailBody("dcnlwhvsdvsa","839200"),
	// 	});
	// }
});
