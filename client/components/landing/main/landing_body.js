import React, {Component} from 'react';
import {Link} from 'react-router';

class LandingBody extends Component {
    render() {
        return (
        	<div>
        		<div className="container-fluid bg-1 text-center">
				  <h1 className="margin">WELCOME TO UNIGHT</h1>
				  <img src="http://i.imgur.com/urR5bHp.jpg" className="img-responsive margin center-img card-sup obj-buffer" width="350" height="350" />
				  <form className="form-inline obj-buffer">
				  	<h3>Sign Up Here</h3>
				    <Link to="/user_signup"><button type="button" className="btn btn-success obj-buffer-sides card-1"><h4>Sign Up User</h4></button></Link>
				    <Link to="/org_signup"><button type="button" className="btn btn-default obj-buffer-sides card-1"><h4>Sign Up Organization</h4></button></Link>
				  </form>
				</div>
				<div className="container-fluid bg-2 text-center">
				  <h2 className="margin">WHY UNIGHT</h2>
				  <p>
				  	Unight allows users to support and connect with organizations like never before. It is a platform where users can pay monthly tribute to businesses in exchange for better deals and coupons throughout the month. Users have the satisfaction of contributing guaranteed income to their organization of choice while also receiving a discount or special coupon during the month to encourage continued traffic.
Non contributing customers can still support the business by becoming a free member for the business and receive additional information about upcoming events and get better marked coupons at the business. 
Unsure what’s going on tonight? Look no further than Unight for all local events and deals on the main page of the app. The local church you became a member of is having a cookout. The bar down the street is offering 25% off drinks. A familiar band is playing at your old high school. Whatever it is, you can find it on Unight. 
				  </p>
				</div>
				<div className="container-fluid bg-3 text-center">
				  <h2 className="margin">WHAT DO OUR CUSTOMERS SAY</h2><br/>
				  <div className="row">
				    <div className="col-sm-4">
				      <p>We couldn't be happier with Unight after having Belly for so long.</p>
				      <img src="https://static.wixstatic.com/media/5eda8e_af66acbec124f12e8794743541f7400d.jpg/v1/fill/w_370,h_370,al_c,q_80,usm_0.66_1.00_0.01/5eda8e_af66acbec124f12e8794743541f7400d.jpg" className="img-responsive margin" alt="Image"/>
				    </div>
				    <div className="col-sm-4">
				      <p>The ease with which we can reach our community is unparalleled.</p>
				      <img src="http://www.mchs.org/s/1249/images/editor/DSC_4582%20finallr.jpg" className="img-responsive margin" alt="Image"/>
				    </div>
				    <div className="col-sm-4">
				      <p>It's free. It's easy. There's nothing else like it. What more could we want.</p>
				      <img src="http://www.cgmc.org/wp-content/uploads/2015/07/beverly_center_01.jpg" className="img-responsive margin" alt="Image"/>
				    </div>
				  </div>
				</div>
			</div>
        );
    }
}

export default LandingBody;
