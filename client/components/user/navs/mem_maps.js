import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {Pages} from '../../../../imports/collections/pages';
import {Profile} from '../../../../imports/collections/profile';
import {browserHistory} from 'react-router';

class MemMaps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      mapLoaded: false,
      changes: 0,
      map: null,
      style: [
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
      if(props.profile.userZip){
        this.setMaps();
      }
      
      var geocoder = new google.maps.Geocoder();
      var uluru = {lat: 41.8781, lng: -87.6298};
        var map = new google.maps.Map(document.getElementById('mapid'), {
          zoom: 4,
          center: uluru,
  streetViewControl: false,
           disableDefaultUI: true,
           styles: this.state.style

        });
        this.setState({map: map});
        geocoder.geocode({address: (props.profile.longlat0+","+props.profile.longlat1).toString() }, function(results, status) {

            if (status == google.maps.GeocoderStatus.OK) {

              map.setCenter(results[0].geometry.location);
              map.setZoom(12);
            }
        });
        var shape = {
          coords: [1, 1, 1, 20, 18, 20, 18, 1],
          type: 'poly'
        };
        var tempPos;

        function createMarker(latlng, placeUrl, cimg, nameTitle) {
           marker = new google.maps.Marker({
              map: map,
              title: nameTitle,
              icon: {
                  url: cimg,

                  scaledSize: new google.maps.Size(35,35),
              },
              position: latlng,
              url: placeUrl,
           });
           

        }
        cube3.map((c)=>{
            var v = "/user/businesses/"
            console.log(c._id)
          createMarker(new google.maps.LatLng(c.longlat0, c.longlat1), v + c._id + "/", c.proPict, c.orgName)
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
     return false;
   }
   logit(){
    var longlat = [this.state.map.getCenter().lat(),this.state.map.getCenter().lng()];
    Meteor.call("profile.placeLL", longlat, (error,data)=>{
      if(error){
        console.log(error);
      }
      else{
        Meteor.subscribe('allPages');
        Meteor.subscribe('wgot');
        Meteor.subscribe('profile');
        var cube3 = this.props.allPages
        function createMarker(latlng, placeUrl, cimg, nameTitle, map) {
           marker = new google.maps.Marker({
              map: map,
              title: nameTitle,
              icon: {
                  url: cimg,

                  scaledSize: new google.maps.Size(35,35),
              },
              position: latlng,
              url: placeUrl,
           });
           

        }
        cube3.map((c)=>{
            var v = "/user/businesses/"
            console.log(c._id)
          createMarker(new google.maps.LatLng(c.longlat0, c.longlat1), v + c._id + "/", c.proPict, c.orgName, this.state.map)
          google.maps.event.addListener(marker, 'click', (function (marker) {
            return function () {
                browserHistory.push(v + c._id + "/");
            }
        })(marker));
        });
      }
    })
   }

    render() {
        return (
          <div>
            <div className="col-md-6 freeze">
              <div id="mapid" onClick={this.logit.bind(this)}></div>
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
