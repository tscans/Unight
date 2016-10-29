import React from 'react';
import AdminDealBody from './admin_deal_body';

class AdminDealMain extends React.Component {
    render() {
        return (
        	<div>
        		<div className="container-fluid bg-3 text-center">
                    <AdminDealBody />
                </div> 
        	</div>
        );
    }
}

export default AdminDealMain;
