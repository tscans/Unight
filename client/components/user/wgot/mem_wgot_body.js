import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {DandE} from '../../../../imports/collections/dande';
import MemWgotList from './mem_wgot_list';
import MemMaps from '../navs/mem_maps';

class MemWgotBody extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            limpage: this.props.limpage
        }
    }
    rel(){
        console.log('rel');
        this.forceUpdate();
        var geocoder = new google.maps.Geocoder();
        var usezip = this.refs.usezip.value.trim()
        geocoder.geocode({address: usezip }, function(results, status) {

            if (status == google.maps.GeocoderStatus.OK) {
              console.log(results[0].geometry.location);
            }
            Meteor.subscribe('wgot', 3);
        });
    }
    shouldComponentUpdate(props) {
        return true
    }
    render() {
    	if(!this.props.wgot){
    		return <div></div>
    	}
    	console.log(this.props.wgot)
        return (
        	<div>
        		<div className="col-md-6" className="container-fluid bg-3 text-center bump-push-bar">
        			<div className="map-push">
                        <input type="text" ref="usezip"></input>
                        <button onClick={this.rel.bind(this)}>zip</button>
        				<MemWgotList wgot={this.props.wgot}/>
                        <br />
                        <button className="btn btn-extend btn-primary card-1" onClick={() => {this.setState({limpage: this.state.limpage+2});Meteor.subscribe('wgot', this.state.limpage+2)}}><h4>Load More....</h4></button>
        			</div>
        		</div>
        	</div>
        );
    }
}

export default createContainer((props)=>{
    var limit_page = 4;
    Meteor.subscribe('wgot', limit_page);

	return {wgot: DandE.find({}).fetch(), limpage: limit_page}
}, MemWgotBody); 

