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
			currentT: {}
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
				this.forceUpdate()
			}
		})
	}
	onAcceptDeal(t){
		console.log(t)
		Meteor.call('tombook.cashItem', t._id, (error,data)=>{
			if(error){
				console.log(error)
			}
			else{
				console.log('success', data)
				$('#acceptModal').modal('hide');
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
			console.log(t)
			return(
				<div className="card-1 tombook-cards" key={t._id}>
					<a className="float-right btn btn-danger" href="#" onClick={() => {this.onRemove(t)}}><span className="glyphicon glyphicon-remove"></span></a>
					<a className="float-right btn btn-success" href="#" onClick={() => {this.setState({currentT: t})}} data-toggle="modal" data-target="#acceptModal"><span className="glyphicon glyphicon-ok"></span></a>
					<img src={t.image} className="surround map-cards-img" />
					<h2>{t.title}</h2>
					<h4>Expires: {moment(t.expiration.toString()).endOf('day').fromNow()}</h4>
				</div>
			)
		})
	}
	renderOther(){
		console.log(this.props.tbMember)
		if(this.props.tbMember.length==0){
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
					<h4>{t.orgName}</h4>
					</Link>
				</div>
			)
		})
	}
	renderCards(){
		return this.props.tbCards.map((t)=>{
			console.log(t)
			return(
				<div className="card-1 tombook-cards" key={t._id}>
					<h4>{t.where}</h4>
					<h4>{t.amount}</h4>
				</div>
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
	render(){
		return(
			<div>
				<div className="col-md-offset-6">
					{this.renderButton()}
					<h2>Saved Deals</h2>
					{this.renderList()}
					<h2>My Memberships</h2>
					{this.renderOther()}
					<h2>Cards</h2>
					{this.renderCards()}
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
    return {tblist: DandE.find({_id: {$in:tbcb}}).fetch(), 
    tbMember: Pages.find({_id: {$in: bart.goldMember}}).fetch(),
	tbCards: GiftCards.find({}).fetch()}

    
}, MemTblist);  

 