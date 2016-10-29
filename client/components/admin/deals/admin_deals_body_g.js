import React, {Component} from 'react';
import AdminDealsGold from './admin_deals_gold';

class AdminDealsBodyG extends Component {
    render() {
    	if(!this.props.orgGoldDeals){
    		return <div></div>
    	}
        return (
        	<div>
                <AdminDealsGold deals={this.props.orgGoldDeals}/>
        	</div>
        );
    }
}

export default AdminDealsBodyG;

