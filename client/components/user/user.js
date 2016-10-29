import React from 'react';
import UserNav from './navs/user_nav';
import UserFooter from './navs/user_footer';
import {Link, browserHistory} from 'react-router';
import MemMaps from './navs/mem_maps';

export default (props) => {
	var urlName = window.location.pathname;
	if(urlName.includes('wgot')){
		return(
			<div>
				<UserNav />
				<div className="bump-body">
					<MemMaps />
					{props.children}
				</div>
			</div>
		)
	}
	else{
		return(
			<div>
				<UserNav />
				<div className="bump-body">
					{props.children}
				</div>
				<UserFooter />
			</div>
		)
	}
}
