import React, {Component} from 'react';
import SelectNav from './select_nav';
import SelectFooter from './select_footer';
import {Link, browserHistory} from 'react-router';

class AdminSelectMain extends Component {
	renderList(){

		return this.props.pages.map(page=>{
			const url = `/admin/${page._id}/`;
			return(
				<Link to={url} key={page._id}>
					<div className="panel panel-default card-1">
					  <div className="panel-heading">
					    <h3 className="panel-title">{page.orgName}</h3>
					  </div>
					  <div className="panel-body">
					    ID: {page._id}<br/>
					    Address: {page.phyAddress}<br/>
					    Number of Members: {page.pageUsers.length}
					  </div>
					</div>
				</Link>
			)
		})
	}
	rep(){
		this.forceUpdate()
	}
	makePage(event){
		event.preventDefault();
		var orgName = 'Your Business Name Here'
		var proPict = 'http://i.imgur.com/ahJEDUm.png'
		var phyAddress = 'Your Address Here'
		var zipCode = 'Zip Code Here'
		var aboutUs = 'Tell users about your business here!'
		Meteor.call('pages.makePage', orgName, proPict, phyAddress, zipCode, aboutUs, (error, data)=> {
            	if(error){
            		console.log("There was an error");
            		console.log(error);
            	}
            	else{
            		pageId = data.toString()
            		page = this.props.profile
            				

            		Meteor.call('profile.addOwner', page, pageId, (error, data) => {
            			if(error){
            				console.log("There was an error making the addowner");
            				console.log(error);
            			}
            			else{
					        
            			}
            		})
            		
            	}
            	
            })
		this.forceUpdate()
	}
    render() {
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
