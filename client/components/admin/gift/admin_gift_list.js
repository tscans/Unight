import React from 'react';
import {createContainer} from 'meteor/react-meteor-data';
import {GiftCards} from '../../../../imports/collections/giftcards';

class AdminGiftList extends React.Component {
	renderCards(){
		return this.props.adminCards.map((t)=>{
			console.log(t)
			return(
				<div className="card-1 tombook-cards" key={t._id}>
					<h4>Customer Name: {t.userName}</h4>
					<h4>Gift Card Amount: {t.amount}</h4>
				</div>
			)
		})
	}
	render(){
		return(
			<div>
				<h2>Customers With Gift Cards</h2>
				{this.renderCards()}
			</div>
		)
	}
}

export default createContainer((props)=>{
	const theId = Meteor.userId();
    
    var pageID = props.pageId;
	Meteor.subscribe('adminCards', pageID);

    return{adminCards: GiftCards.find({}).fetch()}

	
}, AdminGiftList); 