import React from 'react';
import {Profile} from '../../../../imports/collections/profile';
import {createContainer} from 'meteor/react-meteor-data';
import {DandE} from '../../../../imports/collections/dande';
import moment from 'moment';

class MemTblist extends React.Component {
	onRemove(t){
		console.log(t)
		Meteor.call('tombook.removeItem', t._id, (error,data)=>{
			if(error){
				console.log(error)
			}
			else{
				console.log('success', data)
				this.forceUpdate()
			}
		})
	}
	renderList(){
		console.log(this.props.tblist)
		return this.props.tblist.map((t)=>{
			console.log(t)
			return(
				<div className="card-1 tombook-cards" key={t._id}>
					<a className="float-right btn btn-danger" href="#" onClick={() => {this.onRemove(t)}}><span className="glyphicon glyphicon-remove"></span></a>
					<img src={t.image} className="surround map-cards-img" />
					<h2>{t.title}</h2>
					<h4>Expires: {moment(t.expiration.toString()).endOf('day').fromNow()}</h4>
				</div>
			)
		})
	}
	
	render(){
		return(
			<div>
				<div className="col-md-offset-6">
					{this.renderList()}
				</div>
			</div>
		)
	}
}

export default createContainer((props)=>{
	var tbcb = [];
	props.tombook.tbc.map((tbca)=>{
		tbcb.push(tbca.theID)
	})

    Meteor.subscribe('tblist', tbcb);
    return {tblist: DandE.find({_id: {$in:tbcb}}).fetch()}

    
}, MemTblist);  

 