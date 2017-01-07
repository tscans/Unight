import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Pages} from '../../../../imports/collections/pages';
import {Notification} from '../../../../imports/collections/notification';
import AdminLivelookBody from './admin_livelook_body';

class AdminLivelookMain extends Component {
    checkMembers(){
      if(!this.props.pages.hasMembers){
        var warn = "Warning! Your page does not currently allow memberships. In order to reverse this go to the Home page."
        setTimeout(()=>{alert(warn)},1000)
      }
    }
    render() {
        if(!this.props.pages || !this.props.notifications){
          return <div></div>
        }
        {this.checkMembers()}
        return (
        	<div>
        		<div className="container-fluid bg-3 text-center">
                  <AdminLivelookBody notifications={this.props.notifications} />
            	</div> 
        	</div>
        );
    }
}

export default createContainer((props)=>{
    const theId = Meteor.userId();
    
    var pageID = props.params.pageId
    Meteor.subscribe('pages');
    Meteor.subscribe('notifications');
    return {pages: Pages.findOne({_id: pageID}), notifications: Notification.find({}).fetch()}

  
}, AdminLivelookMain); 