import React, {Component} from 'react';
import {Link, browserHistory} from 'react-router';
import {createContainer} from 'meteor/react-meteor-data';
import {Pages} from '../../../../imports/collections/pages';

class MemMainList extends Component {
	constructor(props){
		super(props);
		this.state = {
			localPages: true
		}
	}
	renderList(){
		if(this.state.localPages){
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
		else{
			return this.props.favPages.map(page=>{
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
		
	}
    render() {
        return (
        	<div>
        		<div className="third-length btn btn-default card-1" onClick={()=>{this.setState({localPages: true})}}><h4>Local</h4></div>
				<div className="third-length btn btn-default card-1" onClick={()=>{this.setState({localPages: false})}}><h4>Favorites</h4></div>
				<div className="bump-body"></div>
        		{this.renderList()}	
        	</div>
        );
    }
}

export default createContainer((props)=>{

    return {allPages: props.allPages, favPages: Pages.find({_id: {$in: props.profile.favPages}}).fetch()}

	
}, MemMainList);