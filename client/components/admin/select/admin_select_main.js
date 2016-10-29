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
						    Address: {page.phyAddress}<br/>
						    About: {page.aboutUs}<br/>
						    Number of Members: {page.pageUsers.length}
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
		var orgName = ''
		var proPict = 'http://i.imgur.com/ahJEDUm.png'
		var phyAddress = ''
		var zipCode = ''
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
					        var marr = "/admin/" + pageId + "/";
            				browserHistory.push(marr)
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
