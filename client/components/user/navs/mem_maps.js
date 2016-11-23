import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {DandE} from '../../../../imports/collections/dande';
import {Profile} from '../../../../imports/collections/profile';

class MemMaps extends React.Component {
	dealSort(){
		
    	var cube = this.props.wgot[0]
    	var cube2 = this.props.wgot[1]
        var cubea = this.props.wgot[2]
        var cubeb = this.props.wgot[3]
    	console.log(cubea)
    	var cube3 = cube.concat(cube2,cubea,cubeb)
    	console.log(cube3)
    	return cube3;
	}
	componentWillReceiveProps(props){
        console.log('maps come up')
    	var cube3 = props.wgot
    	console.log(cube3)
    	var geocoder = new google.maps.Geocoder();
    	var uluru = {lat: 41.8781, lng: -87.6298};
        var map = new google.maps.Map(document.getElementById('mapid'), {
          zoom: 4,
          center: uluru
        });
        console.log('got here')
        geocoder.geocode({address: props.profile.userZip.toString() }, function(results, status) {

            if (status == google.maps.GeocoderStatus.OK) {

              map.setCenter(results[0].geometry.location);
              map.setZoom(12);
            }
        });

        var tempPos;
        function createMarker(latlng) {
           marker = new google.maps.Marker({
              map: map,
              position: latlng
           });

        }
        console.log(cube3)
        cube3.map((c)=>{
        	geocoder.geocode({address: c.phyAddress}, function(results, status) {

                if (status == google.maps.GeocoderStatus.OK) {

                  tempPos = results[0].geometry.location;
                  console.log(tempPos)
                  createMarker(tempPos);
                }
            });
	      	console.log(c.phyAddress)
        	
        });
	}
    render() {
        return (
        	<div>
        		<div className="col-md-6 freeze">
        			<div id="mapid"></div>
        		</div>
        	</div>
        );
    }
}

export default createContainer((props)=>{
    var bar = props.limit_page;
    Meteor.subscribe('wgot', bar);
    Meteor.subscribe('profile');

    return {wgot: DandE.find({}), profile: Profile.findOne({})}
}, MemMaps); 
