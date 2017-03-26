import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {GiftCards} from '../../../../imports/collections/giftcards';
import {Pages} from '../../../../imports/collections/pages';
import AdminRewardsTech from './admin_rewards_tech';

class AdminRewardsMain extends Component {
    constructor(props) {
      super(props);
      this.state={
        showUsers: false,
        showEdit: true
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
    render() {
      if(!this.props.adminCards || !this.props.thisPage || !this.props.allPages){
        console.log('loading')
        return<div></div>
      }
        return (
        	<div>
        		<div className="container-fluid bg-3 text-center">
              <div className="col-md-8 col-md-offset-2">
                <AdminRewardsTech adminCards={this.props.adminCards} thisPage={this.props.thisPage} allPages={this.props.allPages} pageID={this.props.pageID} />
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

  return{adminCards: GiftCards.find({}).fetch(), thisPage: Pages.findOne({_id: pageID}), pageID: pageID, allPages: Pages.find({}).fetch()}

}, AdminRewardsMain); 
