import React from 'react';
import AdminGiftSetup from './admin_gift_setup';
import AdminGiftList from './admin_gift_list';

class AdminGiftBody extends React.Component {
	render(){
		return(
			<div>
				<div className="col-md-6">
					<AdminGiftSetup par={this.props.par} pages={this.props.pages} />
				</div>
				<div className="col-md-6">
					<AdminGiftList pageId={this.props.pageId} />
				</div>
			</div>
		)
	}
}

export default AdminGiftBody;