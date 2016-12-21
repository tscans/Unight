import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {DandE} from '../../../../imports/collections/dande';
import {Link} from 'react-router';
import moment from 'moment';

class MemDealsMap extends React.Component {
	renderList(){
		console.log(this.props.wgot)
		console.log('hahahahaha')
		return this.props.wgot.map(wgot=>{
			console.log(wgot)
			if(wgot.typeDE != "E"){
				var pathName = window.location.pathname;
				var url;
				var beaconProp;
				var twgot;
				if(wgot.typeDE == "GD"){
					beaconProp = "wgot-list-beacon-gold"
					url = `/user/wgot/g/${wgot._id}/`;
				}
				else{
					beaconProp = "wgot-list-beacon-deal"
					url = `/user/wgot/d/${wgot._id}/`;
				}
				return(
					<div className="card-1 card-specs-map" key={wgot._id}>
						<a className="float-right btn btn-success"><span className="glyphicon glyphicon-thumbs-up"><br/>{wgot.upvotes}</span></a>
						<div className={beaconProp}>
						</div>
						<div>
							<img src={wgot.image} className="surround map-cards-img" />
						</div>
					  	<Link to={url}><h4>{wgot.title}</h4></Link>
					  	<p className="small-p">Expires: {moment(wgot.expiration.toString()).format("MMMM Do YYYY")}</p>
					  	<p className="small-p up-a-smidge break-off-text">Description: {wgot.description}</p>

					</div>
				)
			}
			else{
				var pathName = window.location.pathname
				var url = `/user/wgot/e/${wgot._id}/`
				
				return(
					<div className="card-1 card-specs-map" key={wgot._id}>
						<a className="float-right btn btn-success"><span className="glyphicon glyphicon-thumbs-up"><br/>{wgot.upvotes}</span></a>
						<div className="wgot-list-beacon-event">
						</div>
						<div>
							<img src={wgot.image} className="surround map-cards-img" />
						</div>
					  	<Link to={url}><h4>{wgot.title}</h4></Link>
					  	<p className="small-p">Expires: {moment(wgot.expiration.toString()).format("MMMM Do YYYY")}</p>
					  	<p className="small-p up-a-smidge break-off-text">Description: {wgot.description}</p>

					</div>
				)
			}
		})
	}
	render(){
		if(!this.props.wgot){
			return<div></div>
		}
		return(
			<div>
				{this.renderList()}
			</div>
		)
	}
}

export default createContainer((props)=>{
	console.log(props.pageID)
    Meteor.subscribe('pageDeals', props.pageID);

    return {wgot: DandE.find({}).fetch()}

	
}, MemDealsMap); 
