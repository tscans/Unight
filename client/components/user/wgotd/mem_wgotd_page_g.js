import React from 'react';
import moment from 'moment';

class MemWgotdPageG extends React.Component {
    render() {
        if(!this.props.wgot){
        	return <div></div>
        }
    	console.log(this.props.wgot.expiration)
        return (
        	<div>
        		<h1>{this.props.wgot.title}</h1>
                <h5>{this.props.wgot.forPageName} - {this.props.wgot.phyAddress}</h5>
                <div>
                    <img src={this.props.wgot.image} className="surround wgot-img" />
                </div>
                <h4>Expiration</h4>
                <h6>{moment(this.props.wgot.expiration.toString()).format("MMMM Do YYYY")}</h6>
                <h4>Description</h4>
                <h6>{this.props.wgot.description}</h6>
        	</div>
        );
    }
}

export default MemWgotdPageG;