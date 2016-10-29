import React from 'react';
import AdminEventBody from './admin_event_body';

class AdminEventMain extends React.Component {
    render() {
        return (
        	<div>
        		<div className="container-fluid bg-3 text-center">
                    <AdminEventBody info={this.props} />
                </div> 
        	</div>
        );
    }
}

export default AdminEventMain;