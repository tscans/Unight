import React, {Component} from 'react';
import LandingHeader from '../landing/main/landing_header';
import {Link, browserHistory} from 'react-router';

class NotFound extends Component {
    render() {
        return (
        	<div>
        		<LandingHeader />
            <div className="container-fluid bg-404 text-center">
              <div className="bump-body">
                <div className="col-md-3">
                  <div className="card-2">
                      <Link to={browserHistory.goBack}><button className="btn btn-primary btn-extend"><h4><span className="glyphicon glyphicon-arrow-left"></span> Back</h4></button></Link>
                  </div>
                </div>
              </div>
            </div>
        	</div>
        );
    }
}

export default NotFound; 
