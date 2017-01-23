import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {GiftCards} from '../../../../imports/collections/giftcards';
import {Pages} from '../../../../imports/collections/pages';
import AdminManageBody from './admin_manage_body';

class AdminManageMain extends Component {
    setGoldReq(){
      var requiredForGold = this.refs.goldreq.value.trim();
      var pageID = this.props.params.pageId;
      Meteor.call('pages.updateGoldRequire', pageID, requiredForGold, (error,data)=>{
        if(error){
          console.log(error)
        }
        else{
          console.log(requiredForGold);
        }
      })
    }
    render() {

      if(!this.props.adminCards || !this.props.thisPage){
        return<div></div>
      }
        return (
        	<div>
        		<div className="container-fluid bg-3 text-center">
              <h1 className="margin">Manage Page </h1>
              <div className="col-md-7">
                <AdminManageBody adminCards={this.props.adminCards} thisPage={this.props.thisPage} />
              </div>
              <div className="col-md-5">
                <h3>Set Gold Membership Requirement</h3>
                <p>Set the number of deals a user needs to use before being eligible for Gold Membership (1-10). Current: {this.props.thisPage.requiredForGold.toString()}</p>
                <div className="form-group col-md-6">
                  <input type="number" className="form-control foc-card" ref="goldreq" defaultValue={this.props.thisPage.requiredForGold} placeholder="Deals Needed"/>
                </div>
                <div className="form-group col-md-6">
                  <input type="number" className="form-control foc-card" ref="goldmon" defaultValue={this.props.thisPage.requiredForGold} placeholder="Cost for Gold"/>
                </div>
                <button className="btn btn-success card-1" onClick={this.setGoldReq.bind(this)}>Set Requirement</button>
              </div>
            </div> 
        	</div>
        );
    }
}

export default createContainer((props)=>{
  const theId = Meteor.userId();
    
  var pageID = props.params.pageId;
  Meteor.subscribe('adminCards', pageID);
  Meteor.subscribe('pages');

  return{adminCards: GiftCards.find({}).fetch(), thisPage: Pages.findOne({_id: pageID})}

}, AdminManageMain); 
