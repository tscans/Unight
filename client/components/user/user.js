import React from 'react';
import UserNav from './navs/user_nav';
import UserFooter from './navs/user_footer';
import {Link, browserHistory} from 'react-router';

export default (props) => {
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
