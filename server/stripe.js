import {Profile} from '../imports/collections/profile';
import {Pages} from '../imports/collections/pages';

Meteor.methods({
  'stripe.makeAccount': function(cardToken){
    var user = Meteor.users.findOne(this.userId)._id;
    var stripe = StripeAPI(Meteor.settings.StripePri);
    var acct;
    var profile = Profile.findOne({ownerId: user});
    console.log(profile)
    console.log('check', profile.stripeBusiness == null)
    if(profile.stripeBusiness == null){
      var busCreate = Async.runSync(function(done){
        console.log('running here')
      stripe.accounts.create({
          managed: true,
          country: 'US',
          external_account: {
            object: "bank_account",
            country: "US",
            currency: "usd",
            routing_number: "110000000",
            account_number: "000123456789",
          },
          legal_entity:{
            dob: {
              day: "16",
              month: "02",
              year: "1994",
            },
            first_name: "Tom",
            last_name: "Scanlan",
            type: "company",
            ssn_last_4: "4521",
            address: {
              city: "Chicago",
              line1: "2614 w 106th pl",
              postal_code: "60655",
              state: "IL"
            },
            business_name: "Bla jones",
            business_tax_id: "12-3456789",
            personal_id_number: "327904521"
          },
          tos_acceptance: {
            date: Math.floor(Date.now() / 1000),
            ip: "192.168.1.1"
          }
        }, function(error, account) {
          console.log(error)
          done(error, account);

        });
      })
      if(busCreate.error){
        console.log(error.statusCode)
        console.log(error)
      }
      else{
        console.log(busCreate.result.id)
        var user = this.userId.toString();
        var profile = Profile.findOne({ownerId: user});
        Profile.update(profile._id, {$set:{stripeBusiness: busCreate.result.id}});
      }

    }
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
        return
      }
    }
    var user = this.userId.toString();
    var profile = Profile.findOne({ownerId: user});
    if((profile.stripeBusCust != null) && (profile.stripeBusiness != null)){
      Profile.update(profile._id, {$set:{stripeBusiness: busCreate.result.id, businessVerified: true}});
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
        throw new Meteor.error(500, "stripe-error", custCreate.error.message);
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
        throw new Meteor.error(500, "stripe-error", custUpdate.error.message);
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

});




