import React, {Component} from 'react';
import {Link} from 'react-router';

class UserFooter extends Component {
    render() {
        return (
        	<footer className="container-fluid bg-1 text-center">
			  <p>Founder Tom Scanlan</p>
			  <p>Lead Design Jimmy Norris</p>
			  <p>Lead Mobile Engineer Tyler Stanish</p><br/>
			  <Link to="/"><p>To Home</p></Link>
			</footer>
        );
    }
}

export default UserFooter;
