import React from 'react';
import {Link, browserHistory} from 'react-router'; 

class AdminDealsGold extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			deleteDeal: false,
			deleteWord: "Delete Deal"
		}
	}
    makeDealsGold(){
    	var str = window.location.pathname;
	    var res = str.substring(7, str.lastIndexOf('/deal'));
	    console.log(res)
	    var pageID = res;
    	var type = "GD";
	   
		
		Meteor.call('dande.makeDandE', pageID, type, (error, data) => {
			if(error){
        		console.log("There was an error");
        		console.log(error);
            }
            else{
            	console.log('completed without error')
            	console.log(data)
            	this.forceUpdate()
            	var marr = window.location.pathname + data.toString() + "/"

            	browserHistory.push(marr)
            }
		});
	}
	reload(){
		this.forceUpdate()
	}
	onDealRemove(deal){
		Meteor.call('dande.removeDandE', deal, (error, data) => {
			if(error){
        		console.log("There was an error");
        		console.log(error);
            }
            else{
            	console.log('completed without error')
            	this.reload()
            }
		});
	}
	toggleDelete(){
		this.setState({deleteDeal: !this.state.deleteDeal})
		if(this.state.deleteWord == "Delete Deal"){
			this.setState({deleteWord: "Done Deleting"})
		}
		else{
			this.setState({deleteWord: "Delete Deal"})
		}
	}
	renderButton(deal){
		if(this.state.deleteDeal == false){
			return <div></div>
		}
		else{
			return (
				<button className="btn card-1 btn-danger button-up" onClick={() => this.onDealRemove(deal)}><span className="glyphicon glyphicon-remove"></span> Remove</button>
			)
		}
	}
	renderList(){
		if(!this.props.deals){
			return <div></div>
		}
		console.log(this.props.deals)
		return this.props.deals.map(deal=>{

			var pathhalf = window.location.pathname;
			if(pathhalf.lastIndexOf('/') == (pathhalf.length-1)){
				pathhalf = pathhalf.slice(0,pathhalf.length -1)
				var url = `${pathhalf}/${deal._id}/`
				console.log('here')
			}
			else{
				var url = `${pathhalf}/${deal._id}/`
				console.log('hd')
			}
			var borderColor;
			if(deal.dealsOn){
				borderColor = "panel card-1 panel-border-green"
			}
			else{
				borderColor = "panel card-1 panel-border-red"
			}
			return(
				<div className="deals-gap col-md-4" key={deal._id}>
					<div>
						<Link to={url}>
			        		<div className={borderColor}>
			        			<div className="gold-header">
			        				Gold Deal
			        			</div>
			        			<img src={deal.image} className="panel-img-head surround" />
			        			<p>{deal.title}</p>
			        			<p>{deal.description}</p>
			        			<p>{deal.expiration}</p>
			        		</div>
						</Link>
					</div>
					{this.renderButton(deal)}
				</div>
			)
		})
	}
    render() {
        return (
        	<div>
	        	<br />
        		<div className="col-md-12">
        			<button className="btn btn-primary card-1" onClick={this.reload.bind(this)}><h4><span className="glyphicon glyphicon-refresh"></span></h4></button>
        			<button className="btn btn-success obj-buffer-sides card-1" onClick={this.makeDealsGold.bind(this)}><h4><span className="glyphicon glyphicon-plus"></span> Make A New Deal</h4></button>
        			<button className="btn btn-danger card-1" onClick={this.toggleDelete.bind(this)}><h4><span className="glyphicon glyphicon-minus"></span> {this.state.deleteWord}</h4></button>
        		</div>
        		<br />
	        	{this.renderList()}
        	</div>
        );
    }
}

export default AdminDealsGold;
