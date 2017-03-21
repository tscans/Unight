import React, {Component} from 'react';
import SelectNav from './select_nav';
import SelectFooter from './select_footer';
import {Link, browserHistory} from 'react-router';

class AdminSelectMain extends Component {
	renderList(){
		return this.props.pages.map(page=>{
			const url = `/admin/${page._id}/`;
			return(
				<div key={page._id}>
					<Link to={url}>
						<div className="panel panel-default card-1">
						  <div className="panel-heading">
						    <h3 className="panel-title">{page.orgName}</h3>
						  </div>
						  <div className="panel-body">
						  	<img src={page.proPict} className="surround map-cards-img" />
						    Address: {page.phyAddress}<br/>
						    About: {page.aboutUs}<br/>
						  </div>
						</div>
					</Link>
				</div>
			)
		})
	}
	rep(){
		this.forceUpdate()
	}
	makePage(event){
		event.preventDefault();
		Meteor.call('pages.makePage', (error, data)=> {
        	if(error){
        		console.log("There was an error");
        		console.log(error);
        	}
        	else{
        		var pageId = data.toString()
        		page = this.props.profile
        		var marr = "/admin/" + pageId + "/";
        		Bert.alert( 'Congradulations on creating a Unight Page!', 'success', 'growl-bottom-right' );
        		browserHistory.push(marr)
        		
        	}
        	
        })
	}
	wrote(){
		if(!this.props.profile.businessVerified){
			var marr = "/admin-select/clearance";
        	browserHistory.push(marr)
		}
	}
    render() {
    	if(!this.props.profile){
    		return <div></div>
    	}
    	this.wrote();
        return (
        	<div>
        		<SelectNav />
				<div className="bump-push-bar">
					<div className="container-fluid bg-1 text-center">
					  <h1 className="margin">Admin Dashboard</h1>
					  <button type="button" className="btn btn-primary obj-buffer-sides card-1" onClick={this.rep.bind(this)}><span className="glyphicon glyphicon-refresh"></span></button>
					  <a href="#" onClick={this.makePage.bind(this)}><button type="button" className="btn btn-success obj-buffer-sides card-1"><h4><span className="glyphicon glyphicon-plus"></span> Create a New Page</h4></button></a>
					  <div className="col-md-8 col-md-offset-2 top-bot-not">
						{this.renderList()}	  
					  </div>
					</div>	
				</div>
				<SelectFooter />
        	</div>
        );
    }
}

export default AdminSelectMain; 
