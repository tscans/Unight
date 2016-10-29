import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {DandE} from '../../../../imports/collections/dande';
import MemWgotList from './mem_wgot_list';

var load_amount = 3;
class MemWgotBody extends React.Component {

    render() {
    	if(!this.props.wgot){
    		return <div></div>
    	}
    	console.log(this.props.wgot)
        return (
        	<div>
        		<div className="col-md-6" className="container-fluid bg-3 text-center bump-push-bar">
        			<div className="map-push">
        				<MemWgotList wgot={this.props.wgot}/>
                        <button onClick={() => {Meteor.subscribe('wgot', 80)}}>Load More....</button>
        			</div>
        		</div>
        	</div>
        );
    }
}

export default createContainer((props)=>{
    Meteor.subscribe('wgot', load_amount);

	return {wgot: DandE.find({}).fetch()}
}, MemWgotBody); 

