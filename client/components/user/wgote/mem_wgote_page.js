import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {DandE} from '../../../../imports/collections/dande';

class MemWgotePage extends React.Component {
    render() {
        if(!this.props.wgot){
        	return <div></div>
        }
    	console.log(this.props.wgot)
        return (
        	<div>
                <h1>{this.props.wgot.title}</h1>
                <h5>{this.props.wgot.forPageName} - {this.props.wgot.phyAddress}</h5>
                <div>
                    <img src={this.props.wgot.image} className="surround wgot-img" />
                </div>
                <h4>Date</h4>
                <h6>{this.props.wgot.dateTime}</h6>
                <h4>Description</h4>
                <h6>{this.props.wgot.description}</h6>
                <h4>Number of People Attending</h4>
                <h6>{this.props.wgot.numAttending}</h6>
            </div>
        );
    }
}

export default createContainer((props)=>{
    Meteor.subscribe('wgot');
    return {wgot: DandE.findOne({_id: props.pageId })}
}, MemWgotePage); 