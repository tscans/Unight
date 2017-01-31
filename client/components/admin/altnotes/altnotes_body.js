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
    render() {
        return (
        	<div>
        		<h2>Alt Notes</h2>
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