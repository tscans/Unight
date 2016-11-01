import React from 'react';
import {Link} from 'react-router';
import moment from 'moment';
import zipcodes from 'zipcodes';

class MemWgotList extends React.Component {
	upVote(dandeID){
		Meteor.call('dande.upvotes', dandeID, (error, data)=>{
			if(error){
				console.log(error);
			}
			else{
				console.log('upvoted')
			}
		})
	}
	renderList(){
		return this.props.wgot.map(wgot=>{
			if(wgot.typeDE != "E"){
				var pathName = window.location.pathname;
				var url;
				var beaconProp;
				var twgot;
				if(wgot.typeDE == "GD"){
					beaconProp = "wgot-list-beacon-gold"
					url = `/user/wgot/g/${wgot._id}/`;
				}
				else if(wgot.typeDE == "SD"){
					beaconProp = "wgot-list-beacon-silver"
					url = `/user/wgot/s/${wgot._id}/`;
				}
				else{
					beaconProp = "wgot-list-beacon-deal"
					url = `/user/wgot/d/${wgot._id}/`;
				}
				return(
					<div className="card-1 card-specs-map" key={wgot._id}>
						<a className="float-right btn btn-success" href="#" onClick={() => {this.upVote(wgot._id)}}><span className="glyphicon glyphicon-thumbs-up"><br/>{wgot.upvotes}</span></a>
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
						<a className="float-right btn btn-success" href="#" onClick={() => {this.upVote(wgot._id)}}><span className="glyphicon glyphicon-thumbs-up"><br/>{wgot.upvotes}</span></a>
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
    render() {
    	if(!this.props.wgot){
    		return<div>loading...</div>
    	}
    	console.log(zipcodes.radius(60453,2))
        return (
	        <div>
	        	<div className="ScrollStyle">
				  {this.renderList()}
				</div>
	        </div>
        )
    }
}

export default MemWgotList;
