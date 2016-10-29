import React from 'react';
import AdminNav from './navs/admin_nav';
import AdminFooter from './navs/admin_footer';
import {Link, browserHistory} from 'react-router';

export default (props) => {
	var parseID = props.params.pageId;
	console.log(parseID);
	if(parseID.constructor === Array){
		parseID = parseID[0]
	}
	console.log(parseID)

	
	return(
		<div>
			<div>
				<ul className="navigation bump-push-bar">
					<li className="nav-item"><Link to={`/admin/${parseID}/`}><span className="glyphicon glyphicon-home"></span> Home</Link></li>
					<li className="nav-item"><Link to={`/admin/${parseID}/manage`}><span className="glyphicon glyphicon-stats"></span> Manage</Link></li>
					<li className="nav-item"><Link to={`/admin/${parseID}/livelook`}><span className="glyphicon glyphicon-time"></span> Livelook</Link></li>
					<li className="nav-item"><Link to={`/admin/${parseID}/events`}><span className="glyphicon glyphicon-calendar"></span> Events</Link></li>
					<li className="nav-item"><Link to={`/admin/${parseID}/deals/`}><span className="glyphicon glyphicon-user"></span> Deals</Link></li>
					<li className="nav-item"><Link to={`/admin-select/`}><span className="glyphicon glyphicon-th-list"></span> Dashboard</Link></li>
				</ul>

				<input type="checkbox" id="nav-trigger" className="nav-trigger" />
				<label className="card-sup img-responsive" htmlFor="nav-trigger"></label>

				<div className="site-wrap">
					<AdminNav />
					<div className="bump-body">
						{props.children}	
					</div>
					<AdminFooter />
				</div>	
			</div>
		</div>
	)
}
