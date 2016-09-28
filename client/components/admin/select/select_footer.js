import React, {Component} from 'react';
import {Link} from 'react-router';

class SelectFooter extends Component {
    render() {
        return (
        	<footer className="container-fluid bg-4 text-center">
			  <p>Founder Tom Scanlan</p><br/>
			  <p>Lead Design Jimmy Norris</p><br/>
			  <Link to="/"><p>To Home</p></Link>
			</footer>
        );
    }
}

export default SelectFooter;
