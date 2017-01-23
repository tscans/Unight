import React, {Component} from 'react';
import {Link} from 'react-router';

class AdminFooter extends Component {
    render() {
        return (
        	<footer className="container-fluid bg-4 text-center">
			  <p>Founder Tom Scanlan</p>
			  <p>Lead Design Jimmy Norris</p>
			  <p>Lead Mobile Engineer Tyler Stanish</p><br/>
			  <Link to="/"><p>To Home</p></Link>
			</footer>
        );
    }
}

export default AdminFooter;
