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
        		<div className="col-md-6 col-md-offset-6">
        			<MemOrgRight pages={this.props.memOrgPage} />
        		</div>
        	</div>
        );
    }
}

export default createContainer((props)=>{
	const theId = Meteor.userId();
    
    var pageID = props.params.pageId;
    Meteor.subscribe('memOrgPage');

    return {memOrgPage: Pages.findOne({_id: pageID})}

	
}, MemOrgBody); 
