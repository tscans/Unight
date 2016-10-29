import React, {Component} from 'react';
import AdminDealsSilver from './admin_deals_silver';

class AdminDealsBodyS extends Component {
    render() {
    	if(!this.props.orgSilverDeals){
    		return <div></div>
    	}
        return (
        	<div>
                <AdminDealsSilver deals={this.props.orgSilverDeals}/>
        	</div>
        );
    }
}

export default AdminDealsBodyS;


