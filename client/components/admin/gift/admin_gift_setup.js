import React from 'react';

class AdminGiftSetup extends React.Component {
	constructor(props){
		super(props);
		var ad = "btn btn-danger card-1 top-bot-not width-button-gift";
		var am = "btn btn-danger card-1 top-bot-not width-button-gift";
		var ae = "btn btn-danger card-1 top-bot-not width-button-gift";
		var ag = "btn btn-danger card-1 top-bot-not width-button-gift";
		var d = "Don't Allow $10 Gift Cards";
		var m = "Don't Allow $20 Gift Cards";
		var e = "Don't Allow $50 Gift Cards";
		var g = "Don't Allow $100 Gift Cards";
		if(this.props.pages.allowedGifts[0]){
			ad = "btn btn-success card-1 top-bot-not width-button-gift";
			d = "Allow $10 Gift Cards";
		}
		if(this.props.pages.allowedGifts[1]){
			am = "btn btn-success card-1 top-bot-not width-button-gift";
			m = "Allow $20 Gift Cards";
		}
		if(this.props.pages.allowedGifts[2]){
			ae = "btn btn-success card-1 top-bot-not width-button-gift";
			e = "Allow $50 Gift Cards";
		}
		if(this.props.pages.allowedGifts[3]){
			ag = "btn btn-success card-1 top-bot-not width-button-gift";
			g = "Allow $100 Gift Cards";
		}
		console.log(ad)
		this.state = {
			savedClass: "btn btn-primary card-1 top-bot-not",
			savedWords: "Save Changes",
			invis: "transparent",
			done: "Changes Saved",
			allowTen: ad,
			allowTwenty: am,
			allowFifty: ae,
			allowHundred: ag,
			ten: d,
			twenty: m,
			fifty: e,
			hundred: g
		}
	}
	editPageData(event){
		event.preventDefault();
        var ten = false;
        var twenty = false;
        var fifty = false;
        var hundred = false;
        if(!this.state.ten.includes("Don")){
			ten = true;
		}
		if(!this.state.twenty.includes("Don")){
			twenty = true;
		}
        if(!this.state.fifty.includes("Don")){
			fifty = true;
		}
		if(!this.state.hundred.includes("Don")){
			hundred = true;
		}
		console.log(this.props.par.pageId)
		Meteor.call('pages.changeGifts', this.props.par.pageId, [ten,twenty,fifty,hundred], (error, data) => {
			if(error){
        		console.log("There was an error");
        		console.log(error);
            }
            else{
            	console.log('completed without error')
            	this.setState({savedClass: "btn btn-success top-bot-not", savedWords: "Changes Saved", invis: "saved-green"})
            	setTimeout(()=>{this.setState({savedClass: "btn btn-primary card-1 top-bot-not", savedWords: "Save Changes", invis: "transparent"})},2500)
            }
		});
		
	}
	onTen(){
		if(!this.state.ten.includes("Don")){
			this.setState({allowTen: "btn btn-danger card-1 top-bot-not width-button-gift"});
			this.setState({ten: "Don't Allow $10 Gift Cards"});
		}
		else{
			this.setState({allowTen: "btn btn-success card-1 top-bot-not width-button-gift"});
			this.setState({ten: "Allow $10 Gift Cards"});
		}
	}
	onTwenty(){
		if(!this.state.twenty.includes("Don")){
			this.setState({allowTwenty: "btn btn-danger card-1 top-bot-not width-button-gift"});
			this.setState({twenty: "Don't Allow $20 Gift Cards"});
		}
		else{
			this.setState({allowTwenty: "btn btn-success card-1 top-bot-not width-button-gift"});
			this.setState({twenty: "Allow $20 Gift Cards"});
		}
	}
	onFifty(){
		if(!this.state.fifty.includes("Don")){
			this.setState({allowFifty: "btn btn-danger card-1 top-bot-not width-button-gift"});
			this.setState({fifty: "Don't Allow $50 Gift Cards"});
		}
		else{
			this.setState({allowFifty: "btn btn-success card-1 top-bot-not width-button-gift"});
			this.setState({fifty: "Allow $50 Gift Cards"});
		}
	}
	onHundred(){
		if(!this.state.hundred.includes("Don")){
			this.setState({allowHundred: "btn btn-danger card-1 top-bot-not width-button-gift"});
			this.setState({hundred: "Don't Allow $100 Gift Cards"});
		}
		else{
			this.setState({allowHundred: "btn btn-success card-1 top-bot-not width-button-gift"});
			this.setState({hundred: "Allow $100 Gift Cards"});
		}
	}
	render(){
		if(!this.props.pages){
			return<div></div>
		}
		return(
			<div>
				<h2>Admin Gift Card Controls</h2>
				<div className="card-3 white-back">
	        		<div>
					  <div className={this.state.allowTen} onClick={this.onTen.bind(this)}><h4> {this.state.ten}</h4></div>
					  <div className={this.state.allowTwenty} onClick={this.onTwenty.bind(this)}><h4> {this.state.twenty}</h4></div>
					  <div className={this.state.allowFifty} onClick={this.onFifty.bind(this)}><h4> {this.state.fifty}</h4></div>
					  <div className={this.state.allowHundred} onClick={this.onHundred.bind(this)}><h4> {this.state.hundred}</h4></div>
				  	</div>
				  	<div className={this.state.invis}>
				  		<p>{this.state.done}</p>
				  	</div>
					<button type="submit" onClick={this.editPageData.bind(this)} className={this.state.savedClass}><span className="glyphicon glyphicon-ok"></span> {this.state.savedWords}</button>
		       	</div>
			</div>
		)
	}
}

export default AdminGiftSetup;