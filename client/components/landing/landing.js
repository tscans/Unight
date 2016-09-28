import React from 'react';
import LandingHeader from './main/landing_header';
import LandingFooter from './main/landing_footer';

export default (props) => {
	return(
		<div>
			<LandingHeader />
			<div className="bump-body">
				{props.children}	
			</div>
			<LandingFooter />
		</div>
	)
}