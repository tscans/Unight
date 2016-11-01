import React from 'react';
import UserNav from './navs/user_nav';
import UserFooter from './navs/user_footer';
import {Link, browserHistory} from 'react-router';
import MemMaps from './navs/mem_maps';

export default (props) => {
	var urlName = window.location.pathname;
	return(
		<div>
			<UserNav />
			<MemMaps />
			<div className="bump-body">
				{props.children}
			</div>
		</div>
	)
}
