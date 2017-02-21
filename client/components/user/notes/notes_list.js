import React, {Component} from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import moment from 'moment';

class NotesList extends Component{
	removeNote(nid){
		Meteor.call('notification.deleteNotification',nid,(error,data)=>{
			if(error){
				console.log(error);
			}
			else{
				console.log(data);
				this.forceUpdate();
			}
		})
	}
	renderCards(){
        if(this.props.notes.length == 0){
            return(
                <div>
                    <h3>You have no notifications.</h3>
                </div>
            )
        }
        var notes = this.props.notes.reverse();
        return notes.map((n)=>{
            var point = n._id;
            return(
                <div key={n._id}>
                    <div className="card-1 note-cards">
                        <div className="wgot-list-beacon-bar"></div>
                        <div className="col-md-1 float-right-alt">
							<button className="float-right btn btn-danger" onClick={() => {this.removeNote(n._id)}}><span className="glyphicon glyphicon-remove"></span></button>
						</div>
                        <div className="col-md-3">
                            <h4>{moment(n.createdAt.toString()).calendar()}</h4>
                        </div>
                        <div className="col-md-8 bud-left">
                            <h4>{n.message}</h4>
                        </div>
                    </div>
                </div>
            )
        })
    }
	render(){
		console.log('live')
		return(
			<div>
				{this.renderCards()}
			</div>
		)
	}
}

export default NotesList;