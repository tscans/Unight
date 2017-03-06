import React, {Component} from 'react';
import {Link, browserHistory} from 'react-router';
import {createContainer} from 'meteor/react-meteor-data';

class MemMainList extends Component {

	renderList(){
		return this.props.allPages.map(page=>{
			const url = `/user/businesses/${page._id}/`;
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
						    Rewards Plan: {page.requiredForGoal.toString()} purchases for ${page.moneyForGoal.toFixed(2).toString()}
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

export default createContainer((props)=>{

    return {allPages: props.allPages}

	
}, MemMainList);