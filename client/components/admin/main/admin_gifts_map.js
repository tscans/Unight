import React from 'react';

class AdminGiftsMap extends React.Component {
	renderTen(){
		if(this.props.pages.allowedGifts[0]){
			return(
				<div className="btn btn-success card-1 top-bot-not width-button-gift">Purchase $10 Gift Card</div>
			)
		}
		else{
			return<div></div>
		}
	}
	renderTwenty(){
		if(this.props.pages.allowedGifts[1]){
			return(
				<div className="btn btn-success card-1 top-bot-not width-button-gift">Purchase $20 Gift Card</div>
			)
		}
		else{
			return<div></div>
		}
	}
	renderFifty(){
		if(this.props.pages.allowedGifts[2]){
			return(
				<div className="btn btn-success card-1 top-bot-not width-button-gift">Purchase $50 Gift Card</div>
			)
		}
		else{
			return<div></div>
		}
	}
	renderHundred(){
		if(this.props.pages.allowedGifts[3]){
			return(
				<div className="btn btn-success card-1 top-bot-not width-button-gift">Purchase $100 Gift Card</div>
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
			</div>
		)
	}
}

export default AdminGiftsMap;