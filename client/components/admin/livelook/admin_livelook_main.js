import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Pages} from '../../../../imports/collections/pages';

class AdminLivelookMain extends Component {
    checkMembers(){
      if(!this.props.pages.hasMembers){
        var warn = "Warning! Your page does not currently allow memberships. In order to reverse this go to the Home page."
        setTimeout(()=>{alert(warn)},1000)
      }
    }
    render() {
        if(!this.props.pages){
          return <div></div>
        }
        {this.checkMembers()}
        return (
        	<div>
        		<div className="container-fluid bg-3 text-center">
                  <h1 className="margin">Live Look Page </h1>
                  <h1 className="margin">Live Look Page </h1>
                  <h1 className="margin">Live Look Page </h1>
                  <h1 className="margin">Live Look Page </h1>
            	</div> 
        	</div>
        );
    }
}

export default createContainer((props)=>{
    const theId = Meteor.userId();
    
    var pageID = props.params.pageId
    console.log(pageID)
    Meteor.subscribe('pages');

    return {pages: Pages.findOne({_id: pageID})}

  
}, AdminLivelookMain); 