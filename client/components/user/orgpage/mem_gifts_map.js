import React from 'react';
import {Link, browserHistory} from 'react-router';

class MemGiftsMap extends React.Component {
	constructor(props){
		Stripe.setPublishableKey(Meteor.settings.public.StripePub);
		super(props);
		this.state = {
			giftClicked: 0,
			custCard: null,
			returnedOnce: false,
			surveySet: true,
			friendSelect: null,
			showFriends: false
		}
	}
	addCard(){
		console.log('added');
      	
	    var friend = this.state.friendSelect;

		console.log('should not run if error');
		Meteor.call('giftcards.addGiftCard', Meteor.userId(), this.props.pageID, this.state.giftClicked, friend, (error,data)=>{
	        if(error){
	        	Bert.alert(error.message, 'danger', 'growl-bottom-right' );
	          console.log(error)
	        }
	        else{
	          console.log(data)
	          $('#giftModal').modal('hide');
	          Bert.alert('Purchase Successful! Thanks for using Unight!', 'success', 'growl-bottom-right' );
	        }
	    })
	}
	giveCardAway(){
		if(this.state.friendSelect){
			return(
				<div>
					You have chosen to give this card to {this.state.friendSelect.name}
				</div>
			)
		}
	}
	renderButton(){
		switch (this.state.giftClicked) {
		    case 0:
		        amountMoney = "$10";
		        break;
		    case 1:
		    	amountMoney = "$20";
		    	break;
		    case 2:
		    	amountMoney = "$50";
		    	break;
		    case 3:
		    	amountMoney = "$100";
		    	break;
		}
		var custCard = null;
		Meteor.call("stripe.obtainCardInfo", (error,data)=>{
			if(error){
				Bert.alert(error.message, 'danger', 'growl-bottom-right' );
				console.log(error);
			}
			else{
				console.log(data);
				if(!this.state.returnedOnce){
					this.setState({custCard: data, returnedOnce: true})
				}

			}
		})
        return(
          <div>
            <div className="modal fade all-black" id="giftModal" role="dialog">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                        <h4 className="modal-title">Purchase a Gift Card {amountMoney}</h4>
                      </div>
                      <div className="modal-body">
                      	{this.cardSurvey()}
                      	{this.giveCardAway()}
                      	<button className="btn btn-primary top-bot-not" onClick={()=>{this.setState({showFriends: !this.state.showFriends})}}>Give Card to a Friend</button>
                        {this.listFriends()}

                        <p>Are you sure you want to purchase a gift card for {amountMoney}?</p>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-success" onClick={this.addCard.bind(this)}>Purchase Gift Card</button>
                        <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                      </div>
                    </div>
                  </div>
              </div>
          </div>
        )
    }
    setFriend(f){
		this.setState({friendSelect: f})
	}
	listFriends(){
		if(this.state.showFriends){
			if(this.props.profile.friendUsers.length == 0){
				return<div>You have no friends saved. To add friends go to your Account page.</div>
			}
			else{
				return this.props.profile.friendUsers.map(f=>{
					return(
						<div key={f.name}>
							<a className="float-right btn btn-success" href="#" onClick={() => {this.setFriend(f)}}><span className="glyphicon glyphicon-user"></span></a>
							<p>{f.name} -- {f.number}</p>
						</div>
					)
				})
			}
		}
		else{
			return(
				<div></div>
			)
		}
	}
	toFinance(){
		$('#giftModal').modal('hide');
		browserHistory.push('/user/finance');
	}
    cardSurvey(){
    	if(!this.state.custCard){
    		return<div></div>
    	}
    	if(this.state.custCard.hasCard){
    		return(
    			<div>
    				<p>Current Saved Payment Information</p>
    				<p><b>{this.state.custCard.cardInfo.brand}</b> ending in <b>{this.state.custCard.cardInfo.last4}</b> -- 
    				Expires: <b>{this.state.custCard.cardInfo.exp_month}/{this.state.custCard.cardInfo.exp_year}</b></p>
    			</div>
    		)
    	}else{
	    	return(
	    		<div>
	    			No credit card on file. Please head to <a href="#" onClick={this.toFinance.bind(this)}>the finance page</a> to enter a credit card.
	    		</div>
	    	)
	    }
    }
	renderTen(){
		if(this.props.pages.allowedGifts[0]){
			return(
				<div className="btn btn-success card-1 top-bot-not width-button-gift" onClick={()=>{this.setState({giftClicked: 0})}} data-toggle="modal" data-target="#giftModal">Purchase $10 Gift Card</div>
			)
		}
		else{
			return<div></div>
		}
	}
	renderTwenty(){
		if(this.props.pages.allowedGifts[1]){
			return(
				<div className="btn btn-success card-1 top-bot-not width-button-gift" onClick={()=>{this.setState({giftClicked: 1})}} data-toggle="modal" data-target="#giftModal">Purchase $20 Gift Card</div>
			)
		}
		else{
			return<div></div>
		}
	}
	renderFifty(){
		if(this.props.pages.allowedGifts[2]){
			return(
				<div className="btn btn-success card-1 top-bot-not width-button-gift" onClick={()=>{this.setState({giftClicked: 2})}} data-toggle="modal" data-target="#giftModal">Purchase $50 Gift Card</div>
			)
		}
		else{
			return<div></div>
		}
	}
	renderHundred(){
		if(this.props.pages.allowedGifts[3]){
			return(
				<div className="btn btn-success card-1 top-bot-not width-button-gift" onClick={()=>{this.setState({giftClicked: 3})}} data-toggle="modal" data-target="#giftModal">Purchase $100 Gift Card</div>
			)
		}
		else{
			return<div></div>
		}
	}
	render(){
		if(!this.props.pages){
			return<div><img src="http://i.imgur.com/TwejQKK.gif" height="100px" /></div>
		}
		console.log(this.props.pages)
		return(
			<div>
				<h3>AdminGiftsMap</h3>
				{this.renderTen()}
				{this.renderTwenty()}
				{this.renderFifty()}
				{this.renderHundred()}
				{this.renderButton()}
			</div>
		)
	}
}

export default MemGiftsMap;