import React from 'react';
import {Profile} from '../../../../imports/collections/profile';
import {createContainer} from 'meteor/react-meteor-data';
import {DandE} from '../../../../imports/collections/dande';

class MemTblist extends React.Component {
	onRemove(t){
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
			return(
				<div className="card-1 tombook-cards" key={t._id}>
					<a className="float-right btn btn-danger" href="#" data-toggle="modal" data-target="#myModal"><span className="glyphicon glyphicon-remove"></span></a>
					<h2>{t.title}</h2>
					  <div className="modal fade" id="myModal" role="dialog">
					    <div className="modal-dialog">
					    
					     
					      <div className="modal-content">
					        <div className="modal-header">
					          <button type="button" className="close" data-dismiss="modal">&times;</button>
					          <h4 className="modal-title">Remove Deal</h4>
					        </div>
					        <div className="modal-body">
					          <p>Are you sure you want to remove this deal from your TomBook?</p>
					        </div>
					        <div className="modal-footer">
					          <button type="button" className="btn btn-danger" data-dismiss="modal" onClick={() => {this.onRemove(t)}}>Remove</button>
							  <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
					        </div>
					      </div>
					      
					    </div>
					  </div>
				</div>
			)
		})
	}
	
	render(){
		return(
			<div className="col-md-8 col-md-offset-2">
				{this.renderList()}
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
    return {tblist: DandE.find({}).fetch()}

    
}, MemTblist);  

 