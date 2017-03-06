import React from 'react';
import AdminDealBodyG from './admin_deal_body_g';

class AdminDealMainG extends React.Component {
    render() {
        return (
        	<div>
        		<div className="container-fluid bg-3 text-center">
                    <AdminDealBodyG params={this.props.params}/>
                </div> 
        	</div>
        );
    }
}

export default AdminDealMainG;
