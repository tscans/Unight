import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {GiftCards} from '../../../../imports/collections/giftcards';
import {Pages} from '../../../../imports/collections/pages';
import AdminManageBody from './admin_manage_body';
import AdminManageTech from './admin_manage_tech';

class AdminManageMain extends Component {
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
    renderComponents(){
      if(this.state.showEdit){
        return(
          <div>
            <div className="col-md-8 col-md-offset-2">
              <AdminManageTech adminCards={this.props.adminCards} thisPage={this.props.thisPage} allPages={this.props.allPages} pageID={this.props.pageID} />
            </div>
          </div>
        )
      }
      else{
        return(
          <div>
            <div className="col-md-8 col-md-offset-2">
              <AdminManageBody adminCards={this.props.adminCards} thisPage={this.props.thisPage} allPages={this.props.allPages}/>
            </div>
          </div>
        )
      }
    }
    data(){
      this.setState({showEdit: false});
    }
    mods(){
      this.setState({showEdit: true});
    }
    render() {

      if(!this.props.adminCards || !this.props.thisPage || !this.props.allPages){
        return<div></div>
      }
        return (
        	<div>
        		<div className="container-fluid bg-3 text-center">
              <div className="col-md-10 col-md-offset-1">
                <button className="btn btn-primary third-length card-1" onClick={this.mods.bind(this)}><h4>Manage Modifications</h4></button>
                <button className="btn btn-primary third-length card-1" onClick={this.data.bind(this)}><h4>Manage Data</h4></button>
              </div>
              {this.renderComponents()}
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

}, AdminManageMain); 
