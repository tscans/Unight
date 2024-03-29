import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {DandE} from '../../../../imports/collections/dande';
import {Profile} from '../../../../imports/collections/profile';
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
    checkVerified(){
        if(!this.props.profile.liveProfile){
            Bert.alert("Your account is not verified. Please check your email to verify.", 'warning', 'growl-bottom-right' );
        }
    }
    render() {
    	if(!this.props.wgot || !this.props.profile){
    		return <div><img src="http://i.imgur.com/TwejQKK.gif" height="100px" /></div>
    	}
    	console.log(this.props.wgot)
        this.checkVerified();
        return (
        	<div>
        		<div className="col-md-6" className="container-fluid bg-3 text-center bump-push-bar">
        			<div className="map-push">
        				<MemWgotList wgot={this.props.wgot}/>
                    </div>
        		</div>
        	</div>
        );
    }
}

export default createContainer((props)=>{
    var limit_page = 4;
    Meteor.subscribe('wgot');
    Meteor.subscribe('profile');

	return {wgot: DandE.find({}).fetch(), limpage: limit_page, profile: Profile.findOne({})}
}, MemWgotBody); 

