import React from 'react';
import MemTblist from './mem_tblist';
import {createContainer} from 'meteor/react-meteor-data';
import {Profile} from '../../../../imports/collections/profile';
import {TomBook} from '../../../../imports/collections/tombook';

class MemTomBook extends React.Component {
	render(){
		console.log(Meteor.userId())
		console.log(this.props.tombook)
		if(!this.props.tombook){
    		return <div></div>
    	}
		return (
			<div>
				<div className="container-fluid bg-3 text-center">
					<MemTblist tombook={this.props.tombook}/>
				</div>
			</div>
		)
	}
}

export default createContainer((props)=>{
    Meteor.subscribe('profile');
    Meteor.subscribe('tombook');
    return {profile: Profile.findOne({}), tombook: TomBook.findOne({})}

    
}, MemTomBook);  