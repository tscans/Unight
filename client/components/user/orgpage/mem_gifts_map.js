import React from 'react';

class MemGiftsMap extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			giftClicked: 0
		}
	}
	addCard(){
		console.log('added');
		Meteor.call('giftcards.addGiftCard', Meteor.userId(), this.props.pageID, this.state.giftClicked,(error,data)=>{
	        if(error){
	          console.log(error)
	        }
	        else{
	          console.log(data)
	          $('#giftModal').modal('hide');
	        }
	    })
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
			return<div></div>
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