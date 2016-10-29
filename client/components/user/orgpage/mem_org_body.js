import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Pages} from '../../../../imports/collections/pages';
import MemOrgRight from './mem_org_right';

class MemOrgBody extends Component {
    render() {
    	console.log(this.props.memOrgPage);
        if(!this.props.memOrgPage){
            return(
                <div>loading...</div>
            )
        }
        return (
        	<div className="container-fluid bg-3 text-center bump-push-bar">
        		<div className="col-md-9 col-md-offset-3">
        			<MemOrgRight pages={this.props.memOrgPage} />
        		</div>
        	</div>
        );
    }
}

export default createContainer((props)=>{
	const theId = Meteor.userId();
    var str = window.location.pathname;
    var res = str.substring(18, str.length - 1);
    console.log(res)
    var pageID = res;
    Meteor.subscribe('memOrgPage');

    return {memOrgPage: Pages.findOne({_id: pageID})}

	
}, MemOrgBody); 
