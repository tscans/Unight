import React, {Component} from 'react';
import {GiftCards} from '../../../../imports/collections/giftcards';
import {Pages} from '../../../../imports/collections/pages';
import {PageData} from '../../../../imports/collections/page_data';
import AdminManageBody from './admin_manage_body';

class AdminManageTech extends Component {
    constructor(props) {
      super(props);
      this.state={
        showUsers: false,
        code: null
      }
    }
    setGoldReq(){
      var requiredForGoal = this.refs.goldreq.value.trim();
      var moneyForGoal = this.refs.goldmon.value.trim();
      requiredForGoal = parseInt(requiredForGoal);
      moneyForGoal = parseInt(moneyForGoal);
      if(isNaN(requiredForGoal) || isNaN(moneyForGoal)){
        return;
      }
      var pageID = this.props.params.pageId;
      console.log(requiredForGoal)
      Meteor.call('pages.updateGoalRequire', pageID, requiredForGoal, moneyForGoal, (error,data)=>{
        if(error){
          console.log(error)
        }
        else{
          console.log(requiredForGoal);
        }
      })
    }
    renderNum(){
      if(this.props.thisPage.requiredForGoal){
        return this.props.thisPage.requiredForGoal.toString();
      }
      else{
        return "Not Set"
      }
    }
    renderNum2(){
      if(this.props.thisPage.moneyForGoal){
        
        return ("$"+(this.props.thisPage.moneyForGoal.toFixed(2)).toString());
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
          Bert.alert( error.message, 'danger', 'growl-bottom-right' )
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
    recentCode(){
      if(this.state.code){
        return(
          <div>
            <h4>Code: {this.state.code.toString()}</h4>
          </div>
        )
      }
      else{
        return(
          <div>
            <h4>Code: _ _ _ _</h4>
          </div>
        )
      }
    }
    genCode(){
      Meteor.call('pagedata.createCode', (error,data)=>{
        if(error){
          console.log(error);
        }
        else{
          console.log(data);
          this.setState({code: data.code});

          setTimeout(()=>{this.setState({code: null})}, 15000);
        }
      })
    }
    render() {

      if(!this.props.adminCards || !this.props.thisPage || !this.props.allPages){
        return<div></div>
      }
        return (
        	<div>
        		<div className="white-back card-3">
              
              <div>
                <h3>Rewards Code</h3>
                <p>Generate a rewards code for a customer.</p>
                <button className="btn btn-primary card-1" onClick={this.genCode.bind(this)}>Generate</button>
                {this.recentCode()}
                <br/>

                <h3>Set Rewards Requirement</h3>
                <p>Set the number of deals (4 - 16) a user needs to use before being eligible for gift card rewards and the reward potential ($2.00 - $12.00). Current Deals Needed: {this.renderNum()} Current Reward: {this.renderNum2()}</p>
                <div className="form-group col-md-6">
                  <input type="number" className="form-control foc-card" ref="goldreq" defaultValue={this.props.thisPage.requiredForGoal} placeholder="Deals Needed"/>
                </div>
                <div className="form-group col-md-6">
                  <input type="number" className="form-control foc-card" ref="goldmon" defaultValue={this.props.thisPage.moneyForGoal} placeholder="Reward"/>
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

export default AdminManageTech;
