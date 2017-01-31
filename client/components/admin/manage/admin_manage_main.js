import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {GiftCards} from '../../../../imports/collections/giftcards';
import {Pages} from '../../../../imports/collections/pages';
import AdminManageBody from './admin_manage_body';

class AdminManageMain extends Component {
    constructor(props) {
      super(props);
      this.state={
        showUsers: false
      }
    }
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
    renderNum(){
      if(this.props.thisPage.requiredForGold){
        return this.props.thisPage.requiredForGold.toString();
      }
      else{
        return "Not Set"
      }
    }
    addAltNotes(){
      var email = this.refs.email.value.trim();
      var name = this.refs.name.value.trim();
      var pageID = this.props.params.pageId;
      Meteor.call('pages.addAltNotes', pageID, email, name, (error,data)=>{
        if(error){
          console.log(error)
          Bert.alert( error.message, 'danger', 'fixed-top' )
        }
        else{

        }
      })
    }
    showNoters(){
    if(this.state.showUsers){
        if(this.props.thisPage.altnotes.length == 0){
          return<div>You have no users saved.</div>
        }
        else{
          return this.props.thisPage.altnotes.map(f=>{
            return(
              <div key={f.name}>
                <a className="float-right btn btn-danger" href="#" onClick={() => {this.removeUser(f)}}><span className="glyphicon glyphicon-remove"></span></a>
                <p>{f.name} -- {f.email}</p>
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
    removeUser(f){
      var pageID = this.props.pageID;
      Meteor.call('pages.removeAltNotes', pageID, f.email, (error,data)=>{
        if(error){
          console.log(error);
        }
        else{
          console.log(data);
        }
      })
    }
    showUsers(){
      this.setState({showUsers: !this.state.showUsers});
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
                <p>Set the number of deals a user needs to use before being eligible for Gold Membership (1-10). Current: {this.renderNum()}</p>
                <div className="form-group col-md-6">
                  <input type="number" className="form-control foc-card" ref="goldreq" defaultValue={this.props.thisPage.requiredForGold} placeholder="Deals Needed"/>
                </div>
                <div className="form-group col-md-6">
                  <input type="number" className="form-control foc-card" ref="goldmon" defaultValue={this.props.thisPage.requiredForGold} placeholder="Cost for Gold"/>
                </div>
                <button className="btn btn-success card-1" onClick={this.setGoldReq.bind(this)}>Set Requirement</button>
                <h3>Allow Other Users Notification Privileges</h3>
                <p>Give other users on this app (like employees) the ability to see livelook notifications. Then more devices would be able to see notifications and check if deals are accepted. Only those with Unight accounts can be added.</p>
                <div className="form-group col-md-6">
                  <input type="text" className="form-control foc-card" ref="name" placeholder="User Name"/>
                </div>
                <div className="form-group col-md-6">
                  <input type="email" className="form-control foc-card" ref="email" placeholder="User Email"/>
                </div>
                <button className="btn btn-success card-1" onClick={this.addAltNotes.bind(this)}>Add User</button>
                <br/>
                <br/>
                <button className="btn btn-default card-1" onClick={this.showUsers.bind(this)}>Show Users</button>
                {this.showNoters()}
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

  return{adminCards: GiftCards.find({}).fetch(), thisPage: Pages.findOne({_id: pageID}), pageID: pageID}

}, AdminManageMain); 
