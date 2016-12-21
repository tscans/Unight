import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {GiftCards} from '../../../../imports/collections/giftcards';
import {Pages} from '../../../../imports/collections/pages';
import AdminManageBody from './admin_manage_body';

class AdminManageMain extends Component {
    render() {
      if(!this.props.adminCards){
        return<div></div>
      }
        return (
        	<div>
        		<div className="container-fluid bg-3 text-center">
              <h1 className="margin">Manage Page </h1>
              <AdminManageBody adminCards={this.props.adminCards} />
            </div> 
        	</div>
        );
    }
}

export default createContainer((props)=>{
  const theId = Meteor.userId();
    
  var pageID = props.params.pageId;
  Meteor.subscribe('adminCards', pageID);

  return{adminCards: GiftCards.find({}).fetch()}

}, AdminManageMain); 
