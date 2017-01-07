import React, {Component} from 'react';

class AdminManageBody extends Component {
    someStats(){
      var total = 0;
      this.props.adminCards.map((t)=>{
        total = total + t.amount
      });
      var numUsers = this.props.thisPage.pageUsers.length
      var someStats = [];
      someStats[0] = total;
      someStats[1] = numUsers;
      return someStats
    }
    render() {
      if(!this.props.adminCards){
        return<div></div>
      }
      var total = this.someStats()[0]
      var numUsers = this.someStats()[1]
      return (
      	<div>
          <h3>The total amount of Gift Cards Purchased: {total}</h3>
          <h3>Number of Members to Page: {numUsers}</h3>
      	</div>
      );
    }
}

export default AdminManageBody; 
