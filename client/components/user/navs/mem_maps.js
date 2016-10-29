import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {DandE} from '../../../../imports/collections/dande';

class MemMaps extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			loading: true
		}
	}
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
    	var cube3 = props.wgot
    	console.log(cube3)
    	if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            var map = new google.maps.Map(document.getElementById('mapid'), {
          zoom: 4,
          center: pos
        });
        	})
        } else {
          // Browser doesn't support Geolocation
          console.log('failed')
        }
      
    	var geocoder = new google.maps.Geocoder();
    	
        
        
        var tempPos;
        
        cube3.map((c)=>{
        	geocoder.geocode({'address': "2614 w 106th pl Chicago IL"}, function(results, status) {
	          if (status === 'OK') {
	              tempPos = results[0].geometry.location
	          } else {
	            alert('Geocode was not successful for the following reason: ' + status);
	          }
	      	});
	      	console.log(c.phyAddress)
        	var marker = new google.maps.Marker({
	          position: tempPos,
	          map: map
	        });
        });
	}
	rero(){
		this.forceUpdate();
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
    Meteor.subscribe('wgot', 2);

	return {wgot: DandE.find({}).fetch()}
}, MemMaps); 
