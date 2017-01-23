import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Pages} from '../../../../imports/collections/pages';
import {Profile} from '../../../../imports/collections/profile';
import {browserHistory} from 'react-router';

class MemMaps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mapLoaded: false
    }
  }
	componentWillReceiveProps(props){
      console.log('maps come up')
    	var cube3 = props.allPages
    	console.log(this.state.mapLoaded)
      if(this.state.mapLoaded){
        console.log('returned')
        return true;
      }
      this.setMaps();
    	var geocoder = new google.maps.Geocoder();
    	var uluru = {lat: 41.8781, lng: -87.6298};
      var style = [
          {
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#242f3e"
              }
            ]
          },
          {
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#746855"
              }
            ]
          },
          {
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#242f3e"
              }
            ]
          },
          {
            "featureType": "administrative",
            "elementType": "geometry",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "administrative.locality",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#d59563"
              }
            ]
          },
          {
            "featureType": "poi",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#d59563"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#263c3f"
              }
            ]
          },
          {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#6b9a76"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#38414e"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": "#212a37"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "labels.icon",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#9ca5b3"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#9914a2"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
              {
                "color": "#1f2835"
              }
            ]
          },
          {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#f3d19c"
              }
            ]
          },
          {
            "featureType": "transit",
            "stylers": [
              {
                "visibility": "off"
              }
            ]
          },
          {
            "featureType": "transit",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#2f3948"
              }
            ]
          },
          {
            "featureType": "transit.station",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#d59563"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
              {
                "color": "#17263c"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
              {
                "color": "#515c6d"
              }
            ]
          },
          {
            "featureType": "water",
            "elementType": "labels.text.stroke",
            "stylers": [
              {
                "color": "#17263c"
              }
            ]
          }
        ]
        var map = new google.maps.Map(document.getElementById('mapid'), {
          zoom: 4,
          center: uluru,
  streetViewControl: false,
           disableDefaultUI: true,
           styles: style

        });
        console.log('got here')
        console.log(props.profile.userZip)
        geocoder.geocode({address: props.profile.userZip.toString() }, function(results, status) {

            if (status == google.maps.GeocoderStatus.OK) {

              map.setCenter(results[0].geometry.location);
              map.setZoom(13);
            }
        });

        var tempPos;
        function createMarker(latlng, placeUrl, cimg, nameTitle) {
           marker = new google.maps.Marker({
              map: map,
              title: nameTitle,
              icon: {
                  url: cimg,

                  scaledSize: new google.maps.Size(40,40)
              },
              position: latlng,
              url: placeUrl,
           });
           

        }
        
        console.log(cube3)
        cube3.map((c)=>{
            var v = "/user/memberships/"
            console.log(c._id)
        	createMarker(new google.maps.LatLng(c.longlat[0], c.longlat[1]), v + c._id + "/", c.proPict, c.orgName)
        	google.maps.event.addListener(marker, 'click', (function (marker) {
            return function () {
                browserHistory.push(v + c._id + "/");
            }
        })(marker));
        });
	 }
   setMaps(){
    this.setState({mapLoaded: true})
   }
   shouldComponentUpdate(nextProps, nextState) {
     console.log('shoudl')
     return false;
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
    Meteor.subscribe('allPages');
    Meteor.subscribe('profile');

    return {allPages: Pages.find({}).fetch(), profile: Profile.findOne({})}
}, MemMaps); 
