import React from 'react';
import {Link, browserHistory} from 'react-router';
import moment from 'moment';

class AdminDealsGeneral extends React.Component {
	constructor(props){
		super(props)
		this.state = {
			deleteDeal: false,
			deleteWord: "Delete Deal"
		}
	}
    makeDealsGeneral(){
    	var str = window.location.pathname;
	    var res = str.substring(7, str.lastIndexOf('/deal'));
	    console.log(res)
	    var pageID = res;
	    var type = "DD"
		
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
	updateDealsGeneral(){
		Meteor.call('dande.updateDandE', (error, data) => {
			if(error){
        		console.log("There was an error");
        		console.log(error);
            }
            else{
            	console.log('completed without error')
            }
		});
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
				return(
					<div className="deals-gap col-md-6" key={deal._id}>
						<div>
			        		<div className={borderColor}>
			        			<div className="general-header">
			        				General Deal
			        			</div>
			        			<img src={deal.image} className="panel-img-head surround" />
			        			<div>
				        			<h3>{deal.title}</h3>
				        			<p>{deal.description}</p>
				        			<p>Good For: {deal.startDate}</p>
				        			<p>Upvotes: {deal.upvotes}</p>
				        			<div className="top-bot-not">
										<i className={"fa "+deal.randomIcon+" icon-large "+ " ic-"+deal.randomColor}></i>
									</div>
			        			</div>
			        		</div>
						</div>
						{this.renderButton(deal)}
					</div>
				)
			}
			else{
				borderColor = "panel card-1 panel-border-red"
				return(
					<div className="deals-gap col-md-6" key={deal._id}>
						<div>
							<Link to={url}>
				        		<div className={borderColor}>
				        			<div className="general-header">
				        				General Deal
				        			</div>
				        			<img src={deal.image} className="panel-img-head surround" />
				        			<div className="bud-left-buff">
					        			<h3>{deal.title}</h3>
					        			<p>{deal.description}</p>
					        			<p>Good For: {deal.startDate}</p>
					        			<p>Upvotes: {deal.upvotes}</p>
					        			<div className="top-bot-not">
											<i className={"fa "+deal.randomIcon+" icon-large "+ " ic-"+deal.randomColor}></i>
										</div>
				        			</div>
				        		</div>
							</Link>
						</div>
						{this.renderButton(deal)}
					</div>
				)
			}
			
		})
	}
    render() {
        return (
        	<div>
        		<br />
        		<div className="col-md-12">
        			<button className="btn btn-primary card-1" onClick={this.reload.bind(this)}><h4><span className="glyphicon glyphicon-refresh"></span></h4></button>
        			<button className="btn btn-success card-1 obj-buffer-sides" onClick={this.makeDealsGeneral.bind(this)}><h4><span className="glyphicon glyphicon-plus"></span> Make A New Deal</h4></button>
        			<button className="btn btn-danger card-1" onClick={this.toggleDelete.bind(this)}><h4><span className="glyphicon glyphicon-minus"></span> {this.state.deleteWord}</h4></button>
        		</div>
        		<br />
	        	{this.renderList()}
        	</div>
        );
    }
}

export default AdminDealsGeneral;
