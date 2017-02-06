import React, {Component} from 'react';
import {Link} from 'react-router';

class LandingBody extends Component {
    render() {
        return (
        	<div>
        		<div className="background-img">
	        		<div className="container-fluid bg-1-alpha text-center">
					  <h1 className="margin welcome">WELCOME TO UNIGHT</h1>
					  <img src="http://i.imgur.com/vXs2ksV.png" className="img-responsive margin center-img card-sup obj-buffer" width="350" height="350" />
					  <form className="form-inline obj-buffer">
					    <Link to="/org_signup"><button type="button" className="btn btn-success obj-buffer-sides card-1"><h3>Unight Sign Up</h3></button></Link>
					  </form>
					</div>
				</div>
				<div className="container-fluid bg-3 text-center">
				  <h1 className="pos-up">What Is Unight?</h1>
				  <h2>Unight is the easiest way to get the deals you want.</h2>
				  <div className="col-md-5 bump-body col-md-offset-1">
				  	<h3>Our goal was to make being a customer at a local business easier with technology. Unight makes that possible.</h3>
				  </div>
				  <div className="col-md-6">
				  	<img src="http://i.imgur.com/YCFF4Bm.gif" height="300px" className="round-img"/>
				  </div>
				</div>
				<div className="background-other-img">
					<div className="container-fluid bg-3-full-alpha text-center">
					  <h2 className="pos-up">It is our mission to create the most streamlined </h2><h2>customer loyalty service at the fairest price.</h2>
					  
					  <div className="col-md-5 bump-body col-md-offset-1 pos-up">
					  	<img src="http://i.imgur.com/0laqjxs.png" height="300px" className="round-img"/>
					  </div>
					  <div className="col-md-5 bump-body col-md-offset-1">
					  	<h3>Unight is an inclusive system which gives you the most tools to present your business online.</h3>
					  </div>
					</div>
				</div>
				<div>
					<div className="container-fluid bg-1-blue text-center">
					  <h1 className="pos-up">How Does It Work?</h1>
					  <h2>Offer Deals</h2>
					  <div className="col-md-5 bump-body col-md-offset-1">
					  	<h3 className='pos-up'>Businesses post a deal.</h3><h3>User finds a deal from a list.</h3><h3>User accepts deal at the time of transaction.</h3><h3>Business is notified of the deal redemption.</h3>
					  </div>
					  <div className="col-md-6">
					  	<img src="http://i.imgur.com/eg3pUd4.gif" height="300px" className="round-img"/>
					  </div>
					</div>
				</div>
				<div className="background-other-img-3">
					<div className="container-fluid bg-3-full-alpha text-center">
					  <h2 className="pos-up">Offer Virtual Gift Cards</h2>
					  <div className="col-md-6">
					  	<img src="http://i.imgur.com/WtB94Qj.gif" height="300px" className="round-img"/>
					  </div>
					  <div className="col-md-5 bump-body col-md-offset-1">
					  	<h3 className='pos-up'>User buys gift card for your business.</h3><h3>At the time of transaction user enters amount to pay.</h3><h3>Business is notified of transaction.</h3>
					  </div>
					</div>
				</div>
			</div>
        );
    }
}

export default LandingBody;
