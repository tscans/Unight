import React, {Component} from 'react';
import moment from 'moment';
import {Link, browserHistory} from 'react-router';

class AltNotesBody extends Component {
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
            var numDeals = 0;
            var numGiftCard = 0;
            var numBuyers = 0;
            var numMembers = 0;
            var color;
            if(n.type == "DD" || n.type == "GD"){
                color = "wgot-list-beacon-bar";
                numDeals = numDeals + 1;
            }
            if(n.type == "GC"){
                color = "wgot-list-beacon-bar-green";
                numGiftCard = numGiftCard + 1;
            }
            if(n.type == "GCD"){
                color = "wgot-list-beacon-bar-red";
                numBuyers = numBuyers + 1;
            }
            if(n.type == "GM"){
                color = "wgot-list-beacon-bar-purple";
                numMembers = numMembers + 1;
            }
            var point = n._id;
            return(
                <div key={n._id}>
                    <div className="card-1 note-cards">
                        <div className={color}></div>
                        {this.renderChoice(n)}
                        <div className="col-md-3">
                            <h4>{moment(n.createdAt.toString()).calendar()}</h4>
                        </div>
                        <div className="col-md-7 bud-left">
                            <h4>{n.message}</h4>
                        </div>
                    </div>
                </div>
            )
        })
    }
    runTempModal(nid){
        Meteor.call('notification.acceptNotification',nid,(error,data)=>{
            if(error){
                console.log(error);
                Bert.alert(error.message, 'danger', 'growl-bottom-right' );
            }
            else{
                console.log(data);
                this.forceUpdate();
                Bert.alert('Deal Accepted', 'success', 'growl-bottom-right' );
            }
        });
    }
    removeNote(nid){
        console.log(nid)
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
    renderChoice(n){
        if(n.type=="DD" || n.type == "GD"){
            return(
                <div>
                    <div className="col-md-1 float-left-alt">
                        <button className="float-left btn btn-danger" onClick={() => {this.removeNote(n._id)}}><span className="glyphicon glyphicon-remove"></span></button>
                    </div>
                    <div className="col-md-1 float-right-alt">
                        <button className="float-right btn btn-success" onClick={() => {this.runTempModal(n._id, n.createdAt)}}><span className="glyphicon glyphicon-ok"></span></button>
                    </div>
                </div>
            )
        }
        else{
            return(
                <div>
                    <div className="col-md-1 float-left-alt">
                        <button className="float-left btn btn-danger" onClick={() => {this.removeNote(n._id)}}><span className="glyphicon glyphicon-remove"></span></button>
                    </div>
                </div>
            )
        }
    }
    render() {
        return (
        	<div>
        		<h2>Notifications for {this.props.anp.orgName}</h2>
                <div className="col-md-8 col-md-offset-2">
                    <div className="card-2">
                        <a href="#" onClick={browserHistory.goBack}><button className="btn btn-primary btn-extend"><h4><span className="glyphicon glyphicon-arrow-left"></span> Back</h4></button></a>
                    </div>
                    {this.renderCards()}
                </div>
            </div>
        );
    }
}

export default AltNotesBody;