import {Profile} from '../imports/collections/profile';
import {Pages} from '../imports/collections/pages';
var fs = require('fs');

Meteor.methods({
  'stripe.busAccount':function(auth_code){
    var user = Meteor.users.findOne(this.userId)._id;
    var profile = Profile.findOne({ownerId: user});
    var CLIENT_ID = "ca_9hhNB3fcLdZm79wctX3HQ3MMN91h6v2p";
    var API_KEY = Meteor.settings.StripePri;
    if(profile.stripeBusiness || !auth_code){
      return;
    }else{
      var TOKEN_URI = 'https://connect.stripe.com/oauth/token';
    var AUTHORIZE_URI = 'https://connect.stripe.com/oauth/authorize';

    var qs = require('querystring');
    var request = require('request');
    var express = require('express');
    console.log('hit')

    var code = auth_code;
    console.log('running')
    console.log(code)
    // Make /oauth/token endpoint POST request

    request.post({
      url: TOKEN_URI,
      form: {
        grant_type: "authorization_code",
        client_id: CLIENT_ID,
        code: code,
        client_secret: API_KEY
      }
    }, Meteor.bindEnvironment(function (error, result) {
      //console.log(error)
      //console.log(r)
      console.log(result.body)
      var accessToken = JSON.parse(result.body).stripe_user_id;
      Profile.update(profile._id, {$set:{stripeBusiness: accessToken}})

      console.log(accessToken)

    }));
    var user = this.userId.toString();
    var profile = Profile.findOne({ownerId: user});
    if((profile.stripeBusCust != null) && (profile.stripeBusiness != null)){
      console.log('other')
      Profile.update(profile._id, {$set:{businessVerified: true}});
    }
    }
    

  },
  'stripe.makeAccount': function(cardToken){
    var user = Meteor.users.findOne(this.userId)._id;
    var stripe = StripeAPI(Meteor.settings.StripePri);
    var profile = Profile.findOne({ownerId: user});
    if(profile.stripeBusCust == null){
      var custCreate = Async.runSync(function(done){
        stripe.customers.create({
          source: cardToken
        }, function(error, response){
          done(error, response);
        })
      })

      if(custCreate.error){
        console.log(custCreate.error)
      }else{
        Profile.update(profile._id, {$set: {stripeBusCust: custCreate.result.id}});
      }
    }
    var user = this.userId.toString();
    var profile = Profile.findOne({ownerId: user});
    if((profile.stripeBusCust != null) && (profile.stripeBusiness != null)){
      console.log('Both Complete')
      Profile.update(profile._id, {$set:{businessVerified: true}});
    }
    
  },
  "stripe.userBuyCard": function(cardToken){
    var stripe = StripeAPI(Meteor.settings.StripePri);
    var user = this.userId.toString();
    var profile = Profile.findOne({ownerId: user});
    if(profile.stripeCust == null){
      var custCreate = Async.runSync(function(done){
        stripe.customers.create({
          source: cardToken
        }, function(error, response){
          done(error, response);
        })
      })

      if(custCreate.error){
        throw new Meteor.Error(500, "stripe-error", custCreate.error.message);
      }else{
        Profile.update(profile._id, {$set: {stripeCust: custCreate.result.id}});
        return
      }
    }else{
      var custUpdate = Async.runSync(function(done){
        stripe.customers.update(profile.stripeCust,{
          source: cardToken
        }, function(error, result) {
          done(error, result);
        })
      })

      if(custUpdate.error){
        throw new Meteor.Error(500, "stripe-error", custUpdate.error.message);
      }else{
        return
      }
    }
  },
    "stripe.obtainCardInfo": function(){
      var stripe = StripeAPI(Meteor.settings.StripePri);
      var user = this.userId.toString();
      var profile = Profile.findOne({ownerId: user});
      if(profile.stripeCust == null){
        return {
          "hasCard": false
        }
      }else{
        var custDetails = Async.runSync(function(done){
          stripe.customers.retrieve(profile.stripeCust, function(error, result){
            done(error, result);
          })
        })

        if(custDetails.result.sources.data.length == 0){
          return {
            "hasCard": false
          }
        }else{
          var cardDetails = custDetails.result.sources.data[0];

          return {
            "hasCard": true,
            "cardInfo": {
              "brand": cardDetails.brand,
              "exp_month": cardDetails.exp_month,
              "exp_year": cardDetails.exp_year,
              "last4": cardDetails.last4
            }
          }
        }
      }
  },
  "stripe.obtainCardInfoBus": function(){
      var stripe = StripeAPI(Meteor.settings.StripePri);
      var user = this.userId.toString();
      var profile = Profile.findOne({ownerId: user});
      if(profile.stripeBusCust == null){
        return {
          "hasCard": false
        }
      }else{
        var custDetails = Async.runSync(function(done){
          stripe.customers.retrieve(profile.stripeBusCust, function(error, result){
            done(error, result);
          })
        })

        if(custDetails.result.sources.data.length == 0){
          return {
            "hasCard": false
          }
        }else{
          var cardDetails = custDetails.result.sources.data[0];

          return {
            "hasCard": true,
            "cardInfo": {
              "brand": cardDetails.brand,
              "exp_month": cardDetails.exp_month,
              "exp_year": cardDetails.exp_year,
              "last4": cardDetails.last4
            }
          }
        }
      }
  },
  "stripe.removeCust":function(){
    const user = Meteor.users.findOne(this.userId)._id.toString();
    if(!user){
      return
    }
    var profile = Profile.findOne({ownerId: user});
    Profile.update(profile._id, {$set:{stripeCust: null}});
  }

});




