import React, {Component} from 'react';
import {Link, browserHistory} from 'react-router';
import {createContainer} from 'meteor/react-meteor-data';
import {Pages} from '../../../../imports/collections/pages';

class MemMainList extends Component {
	renderList(){
		
		return this.props.allPages.map(page=>{
			const url = `/admin/${page._id}/`;
			return(
				<Link to={url} key={page._id}>
					<div className="panel panel-default card-1 max-100">
						<div className="bud-left pull-inline left-img">
							<img src={page.proPict} className="panel-body surround" height="100px" width="100px" />
						</div>
						<div className="pull-inline">
							{page.orgName}
						  <div className="panel-body">
						    Address: {page.phyAddress}<br/>
						    Number of Members: {page.pageUsers.length}
						  </div>
						</div>
					</div>
				</Link>
			)
		})
	}
    render() {
        return (
        	<div>
        		{this.renderList()}	  
        	</div>
        );
    }
}

export default createContainer(()=>{
    Meteor.subscribe('allPages');

    return {allPages: Pages.find({}).fetch()}

	
}, MemMainList);  