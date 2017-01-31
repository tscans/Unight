import React, {Component} from 'react';
import {Link, browserHistory} from 'react-router';
import {createContainer} from 'meteor/react-meteor-data';
import {Profile} from '../../../../imports/collections/profile';
import SelectNav from '../select/select_nav';

class AdminSelectMain extends Component {
  constructor(props){
    Stripe.setPublishableKey(Meteor.settings.public.StripePub);
    super(props);
    this.state = {
      gif: "invisible",
      custCard: null,
      returnedOnce: false
    }
  }
	checkCleared(){
		if(!this.props.profile.businessVerified){
			setTimeout(()=>{
				$('#warningModal').modal('show');
			}, 2000);	
		}
    else{
      Bert.alert("You are already verified!", 'info', 'fixed-top' );
    }

	}
	renderModal(){
        return(
          <div>
            <div className="modal fade all-black" id="warningModal" role="dialog">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                    <h4 className="modal-title">Enter Data</h4>
                  </div>
                  <div className="modal-body">
                    Your business account is not verified. Please fill out the following fields to become eligible for creating organization pages.
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-default" data-dismiss="modal">OK</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
    }
    addCreditCard(){
      var cardToken = {
          "number": this.refs.cred.value.trim(),
          "cvc": this.refs.cvc.value.trim(),
          "exp_month": this.refs.mm.value.trim(),
          "exp_year": this.refs.yy.value.trim()
      }
      Stripe.createToken(cardToken, function(status, result){
        if(result.error){
          Bert.alert(result.error.message, 'danger', 'fixed-top' );
        }else{
          Meteor.call('stripe.makeAccount', result.id, (error, data)=>{
              if(error){
                Bert.alert(error.message, 'danger', 'fixed-top' );
                return;
              }else{
                console.log('worked fine')
              }
            })
        }
      })
    }
  verifyStripeBus(){
    var hole = window.location.href.split("code=");
    console.log(hole[1]);
    if(hole[1]){
        this.setState({gif: ""})
        Meteor.call('stripe.busAccount',hole[1],(error,data)=>{
        if(error){
          console.log(error)
        }
        else{
          
        }
      })
    }
    else{
      console.log('worked');
    }
    
  }
  renderTop(){
    if(!this.props.profile.stripeBusiness){
      return(
        <div>
          <p>In order to create an organization with Unight, you must first verify your business through Stripe. Stripe is a suite of APIs that powers commerce for businesses of all sizes. It is what Unight uses to make secure transactions online. In order to get payments from customers, you must verify you have a bank account to deposit them into.</p>
            <div className="text-center col-md-6 col-md-offset-3 top-bot-not">
              <img src="http://i.imgur.com/TwejQKK.gif" height="75px" className={this.state.gif} />
              <a href="https://connect.stripe.com/oauth/authorize?response_type=code&client_id=ca_9hhNB3fcLdZm79wctX3HQ3MMN91h6v2p&scope=read_write">
                <button className="btn btn-default btn-extend card-1">
                    <h5><span className="glyphicon glyphicon-send"></span> Verify Business with Stripe</h5>
                </button>
              </a>
            </div>
        </div>
      )
    }
    else{
      return(
        <h3><span className="glyphicon glyphicon-ok"></span> Business Verified with Stripe!</h3>
      )
    }
  }
  renderBot(){
    if(!this.props.profile.stripeBusCust){
      return(
        <div>
          <div className="col-md-8">
          <label htmlFor="exampleInputEmail1">Card Number</label>
            <input type="text" className="form-control foc-card" ref="cred" placeholder="Card Number"/>
          </div>
          <div className="col-md-4">
            <label htmlFor="exampleInputEmail1">CVC</label>
            <input type="text" className="form-control foc-card input-small" ref="cvc" placeholder="CVC"/>
          </div>
          <div className="col-md-6 top-bot-not">
            <label htmlFor="exampleInputEmail1">Expiration MM</label>
            <input type="text" className="form-control foc-card input-small" ref="mm" placeholder="MM"/>
          </div>
          <div className="col-md-6 top-bot-not">
            <label htmlFor="exampleInputEmail1">Expiration YY</label>
            <input type="text" className="form-control foc-card input-small" ref="yy" placeholder="YY"/>
          </div>
          <div className="col-md-6 col-md-offset-3">
          <button className="btn btn-default btn-extend card-1" onClick={this.addCreditCard.bind(this)}>
              <h4><span className="glyphicon glyphicon-credit-card"></span> Verify Credit Card</h4>
          </button>
          </div>
        </div>
      )
    }
    else{
      this.findCredit();
      if(!this.state.custCard){
        return(
          <div>...Loading</div>
        )
      }
      return(
        <div>
          <h3><span className="glyphicon glyphicon-ok"></span> Credit Card Verified with Stripe!</h3>
          <div>
              <p>Current Saved Payment Information</p>
              <p><b>{this.state.custCard.cardInfo.brand}</b> ending in <b>{this.state.custCard.cardInfo.last4}</b> -- 
              Expires: <b>{this.state.custCard.cardInfo.exp_month}/{this.state.custCard.cardInfo.exp_year}</b></p>
            </div>
        </div>
      )
    }
  }
  findCredit(){
    Meteor.call("stripe.obtainCardInfoBus", (error,data)=>{
      if(error){
        Bert.alert(error.message, 'danger', 'fixed-top' );
        console.log(error);
      }
      else{
        console.log(data);
        if(!this.state.returnedOnce){
          this.setState({custCard: data, returnedOnce: true})
        }
      }
    })
  }
  renderComplete(){
    if(this.props.profile.businessVerified){
      return(
        <div>
          <h3>You are fully verified and can create organization pages.</h3>
          <Link to={"/admin-select/"}>Click here to return to the organization dashboard.</Link>
        </div>
      )
    }
  }
	render(){
		if(!this.props.profile){
			return<div>...Loading</div>
		}

		this.checkCleared();
    this.verifyStripeBus();
		return(
			<div>
				<SelectNav />
				<div className="bump-body">
					<div className="container-fluid bg-3 text-center">
						{this.renderModal()}
						<h1>Verify Business Account With Unight</h1>
            <div className="col-md-6 col-md-offset-3 text-center">
              <div className="text-center">
                {this.renderTop()}
              </div>
              <div className="col-md-12 text-center">
                <br/>
                <p>Unight does not have monthly subscription fees but we do charge organizations monthly for the number of deals which are redeemed. In order to verify your organization, you must put forth a credit or debit card for these charges. Stripe handles the processing fees.</p>
                <br/>
              </div>
              {this.renderBot()}
              {this.renderComplete()}
            </div>
					</div>
				</div>
			</div>
		)
	}
}

export default createContainer((props)=>{
	const theId = Meteor.userId();
	Meteor.subscribe('profile');

	return {profile: Profile.findOne()}

	
}, AdminSelectMain); 
 