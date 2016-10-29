import React from 'react';
import AdminDealCenterS from './admin_deal_center_s';
import {Link} from 'react-router';
import {createContainer} from 'meteor/react-meteor-data';
import {Profile} from '../../../../imports/collections/profile';
import {Pages} from '../../../../imports/collections/pages';
import {DandE} from '../../../../imports/collections/dande';

class AdminDealBodyS extends React.Component {
    render() {
    	var str = window.location.pathname;
	    var res = str.substring(0, str.lastIndexOf('/deal')+6);
        res = res + "-silver/"
	    var pageID = res;
        return (
        	<div>
        		<div className="col-md-2">
        			<div className="arrow-align">
	                    <h1><Link to={pageID}><span className="glyphicon glyphicon-arrow-left card-sup"></span></Link></h1>
	                </div>	
        		</div>
        		<div className="col-md-8">
        			<AdminDealCenterS deals={this.props.orgSilverDeals} />
        		</div>
        	</div>
        );
    }
}

export default createContainer((props)=>{
	const theId = Meteor.userId();
    var str = window.location.pathname;
    var res = str.substring(str.lastIndexOf('/deal') + 14, str.length - 1);
    console.log(res)
    var pageID = res;
	Meteor.subscribe('profile');
    Meteor.subscribe('pages');
    Meteor.subscribe('orgSilverDeals')

    return {profile: Profile.findOne(), pages: Pages.findOne({_id: pageID}), orgSilverDeals: DandE.findOne({_id: pageID})}

	
}, AdminDealBodyS); 