import React, {Component} from 'react';
import AdminDealsGeneral from './admin_deals_general';

class AdminDealsBody extends Component {
    render() {
    	if(!this.props.orgGeneralDeals){
    		return <div></div>
    	}
        return (
        	<div>
                <AdminDealsGeneral deals={this.props.orgGeneralDeals}/>
        	</div>
        );
    }
}

export default AdminDealsBody;



