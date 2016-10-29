import React from 'react';
import {Link, browserHistory} from 'react-router'

class AdminEventsBody extends React.Component {
	makeEvent(){
    	var str = window.location.pathname;
	    var res = str.substring(7, str.lastIndexOf('/events'));
	    console.log(res)
	    var pageID = res;
	    var type = "E";
	
		Meteor.call('dande.makeDandE', pageID, type, (error, data) => {
			if(error){
        		console.log("There was an error");
        		console.log(error);
            }
            else{
            	console.log('completed without error')
            	console.log(data)
            	this.forceUpdate()
            	var pathhalf = window.location.pathname;
				if(pathhalf.lastIndexOf('/') == (pathhalf.length-1)){
					var url = `${pathhalf}${data}/`;
					console.log('here')
				}
				else{
					var url = `${pathhalf}/${data}/`;
					console.log('hd')
				}
            	browserHistory.push(url)
            }
		});
	}
	renderList(){
		if(!this.props.events){
			return <div></div>
		}
		console.log(this.props.events)
		return this.props.events.map(event=>{

			var pathhalf = window.location.pathname;
			if(pathhalf.lastIndexOf('/') == (pathhalf.length-1)){
				var url = `${pathhalf}${event._id}/`;
				console.log('here')
			}
			else{
				var url = `${pathhalf}/${event._id}/`;
				console.log('hd')
			}
			var borderColor;
			if(event.published){
				borderColor = "col-md-6 card-1 events-gap panel-border-green"
			}
			else{
				borderColor = "col-md-6 card-1 events-gap panel-border-red"
			}
			return(
				<Link to={url} key={event._id}>
					<div className={borderColor}>
						<img src={event.image} height="100%" width="50%" className="left surround" />
						<div>
	    					<h4>{event.title.slice(0,20)}</h4>
	    					<h5>{event.dateTime}</h5>
	    					<h6>{event.numAttending}</h6>
						</div>
						<div  className="text-wrap">
							{event.description.slice(0,118) + '...'}
						</div> 
					</div>
				</Link>
			)
		})
	}
    render() {
    	console.log(this.props.events)
        return (
        	<div>
        		<div className="col-md-3">
        			<div className="card-3">
        				<h2>Events Panel</h2>
        				<div className="deals-gap">
        					<button className="btn btn-success card-1" onClick={this.makeEvent.bind(this)}><span className="glyphicon glyphicon-plus"></span> Make New Event</button>
        				</div>
        			</div>
        		</div>
        		<div className="col-md-9">
        			{this.renderList()}
        		</div>
        	</div>
        );
    }
}

export default AdminEventsBody;
