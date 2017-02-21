import React from 'react';
import {Profile} from '../../../../imports/collections/profile';
import {createContainer} from 'meteor/react-meteor-data';
import {DandE} from '../../../../imports/collections/dande';
import {Pages} from '../../../../imports/collections/pages';
import {GiftCards} from '../../../../imports/collections/giftcards';
import moment from 'moment';
import {Link} from 'react-router';

class MemTblist extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			currentT: {},
			currentP: {},
			payAmount: 0,
			payWrite: false,
			failed: "",
			display: "deals"
		}
	}
	onRemove(t){
		console.log(t)
		Meteor.call('tombook.removeItem', t._id, (error,data)=>{
			if(error){
				console.log(error)
			}
			else{
				console.log('success', data)
				Bert.alert( 'Item removed from UBook.', 'default', 'growl-bottom-right' );
				this.forceUpdate()
			}
		})
	}
	onAcceptDeal(t){
		console.log(t)
		Meteor.call('tombook.cashItem', t._id, (error,data)=>{
			if(error){
				console.log(error)
				Bert.alert( error.message, 'danger', 'growl-bottom-right' );
				if(error.error=502){
					this.setState({failed: "\nUser has already used this deal."})
				}
			}
			else{
				console.log('success', data)
				$('#acceptModal').modal('hide');
				Bert.alert( 'Deal Accepted.', 'default', 'growl-bottom-right' );
				this.forceUpdate()
			}
		})
	}
	renderList(){
		console.log(this.props.tblist)
		if(this.props.tblist.length==0){
			return(
				<h3>You have no saved deals or events at this time.</h3>
			)
		}
		return this.props.tblist.map((t)=>{
			var par = "";
			var height = "#";
			var modal;
			modal = "#acceptModal";
			var expiration = t.expiration;
			if(t.typeDE=="E"){
				par = "invisible";
				height="";
				modal = "";
				expiration = t.dateTime;
			}

			console.log(t)
			return(
				<div className="card-1 tombook-cards" key={t._id}>
					<a className="float-right btn btn-danger" href="#" onClick={() => {this.onRemove(t)}}><span className="glyphicon glyphicon-remove"></span></a>
					<a className={"float-right btn btn-success"+par} href={height} onClick={() => {this.setState({currentT: t})}} data-toggle="modal" data-target={modal}><span className={"glyphicon glyphicon-ok"+par}></span></a>
					<img src={t.image} className="surround map-cards-img" />
					<h2>{t.title}</h2>
					<h4>Expires: {moment(expiration).endOf('day').fromNow()}</h4>
				</div>
			)
		})
	}
	renderOther(){
		console.log(this.props.tbMember)
		console.log(this.props)
		if(this.props.profile.goldMember.length==0){
			return(
				<h3>You have no memberships at this time.</h3>
			)
		}
		var bit = "/user/memberships/";
		var v;

		return this.props.tbMember.map((t)=>{
			console.log(t)
			v = t._id;
			return(
				<div className="card-1 tombook-cards" key={t._id}>
					<Link to={bit+v+"/"}>
					<img src={t.proPict} className="surround map-cards-img" />
					<h2>{t.orgName}</h2>
					</Link>
				</div>
			)
		})
	}
	renderCards(){
		if(this.props.tbCards.length==0){
			return(
				<h3>You have no gift cards at this time.</h3>
			)
		}
		return this.props.tbCards.map((p)=>{
			console.log(p)
			return(
				<a href="#" className="all-black" onClick={() => {this.setState({currentP: p})}} key={p._id} data-toggle="modal" data-target="#payModal">
					<div className="card-1 tombook-cards" key={p._id}>
						<div className="wgot-list-beacon-bar"></div>
						<h3><b>{p.where}</b></h3>
						<h4><i>Amount on Card: ${p.amount.toFixed(2)}</i></h4>
					</div>
				</a>
			)
		})
	}
	renderButton(){
		var t = this.state.currentT;
		console.log(t)
        return(
          <div>
            <div className="modal fade all-black" id="acceptModal" role="dialog">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                        <h4 className="modal-title">Use Deal</h4>
                      </div>
                      <div className="modal-body">
                        Do you want to use this deal at this time?
                        {this.state.failed}
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-success"  onClick={() => {this.onAcceptDeal(t)}}>Use Deal</button>
                        <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
                      </div>
                    </div>
                  </div>
              </div>
          </div>
        )
    }
    reloPayRef(){
    	if(!this.state.payWrite){
    		var pay = this.refs.payAmount.value.trim();
	    	pay = parseFloat(pay);
	    	pay = pay.toFixed(2);
	    	this.setState({payWrite: true, payAmount: pay});
    	}
    	else{
    		Meteor.call('giftcards.subtractCredit', Meteor.userId(), this.state.currentP._id, this.state.payAmount, (error,data)=>{
		        if(error){
		          console.log(error)
		          Bert.alert(error.message, 'danger', 'fixed-top' );
		        }
		        else{
		          console.log(data);
		          this.setState({payWrite: false});
		          $('#payModal').modal('hide');
		          Bert.alert('Payment of $'+this.state.payAmount.toString()+' Successful.', 'success', 'fixed-top' );
		        }
		    })
    	}
    }
    renderCardPay(){
		var p = this.state.currentP;
		console.log(p)
		var buttonWrite;
		if(this.state.payWrite){
			buttonWrite = "Confirm Pay $" + this.state.payAmount
		}
		else{
			buttonWrite = "Use Card"
		}
        return(
          <div>
            <div className="modal fade all-black" id="payModal" role="dialog">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                    <h4 className="modal-title">Use Card for {p.where}</h4>
                  </div>
                  <div className="modal-body">
                    <div className="form-group">
					 <label htmlFor="exampleInputEmail1">Amount You Want to Use</label>
					 <input type="number" className="form-control foc-card large-input" ref="payAmount" placeholder="$0.00"/>
					</div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-success" onClick={this.reloPayRef.bind(this)}>{buttonWrite}</button>
                    <button type="button" className="btn btn-default" onClick={()=>{this.setState({payWrite: false})}} data-dismiss="modal">Cancel</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
    }
    checkVerified(){
    	if(!this.props.profile.liveProfile){
    		Bert.alert("Your account is not verified. Please check your email to verify.", 'warning', 'fixed-top' );
    	}
    }
    renderDisplay(){
    	if(this.state.display == "deals"){
    		return(
	    		<div>
	    			<h2>Saved Deals</h2>
					{this.renderList()}
				</div>
    		)
    	}
    	if(this.state.display == "memberships"){
    		return(
    			<div>
	    			<h2>My Memberships</h2>
					{this.renderOther()}
				</div>
    		)
    	}
    	if(this.state.display == "cards"){
    		return(
    			<div>
	    			<h2>My Gift Cards</h2>
					{this.renderCards()}
				</div>
    		)
    	}
    }
	render(){
		if (!this.props.profile){
			return <div><img src="http://i.imgur.com/TwejQKK.gif" height="100px" /></div>
		}
		console.log(this.props.pages)
		this.checkVerified();
		return(
			<div>
				<div className="col-md-offset-6">
					{this.renderCardPay()}
					{this.renderButton()}
					<div className="third-length btn btn-default card-1" onClick={()=>{this.setState({display: "deals"})}}><h3>Deals</h3></div>
					<div className="third-length btn btn-default card-1" onClick={()=>{this.setState({display: "memberships"})}}><h3>Memberships</h3></div>
					<div className="third-length btn btn-default card-1" onClick={()=>{this.setState({display: "cards"})}}><h3>Cards</h3></div>
					{this.renderDisplay()}
				</div>
			</div>
		)
	}
}

export default createContainer((props)=>{
	var tbcb = [];
	props.tombook.tbc.map((tbca)=>{
		tbcb.push(tbca.theID)
	})

	var bart = props.profile;
    Meteor.subscribe('tblist', tbcb);
    Meteor.subscribe('tbMember');
    Meteor.subscribe('userCards');
    Meteor.subscribe('arrayPage');
    return {tblist: DandE.find({_id: {$in:tbcb}}).fetch(), 
    tbMember: Pages.find({_id: {$in: bart.goldMember}}).fetch(),
	tbCards: GiftCards.find({}).fetch(), profile: Profile.findOne({})}

    
}, MemTblist);  

 