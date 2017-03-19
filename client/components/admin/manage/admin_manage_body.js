import React, {Component} from 'react';

class AdminManageBody extends Component {
    someStats(){
      var total = 0;
      this.props.adminCards.map((t)=>{
        total = total + t.amount
      });
      var someStats = [];
      someStats[0] = total;
      someStats[1] = this.props.thisPage.monthlyCount;
      someStats[2] = this.props.thisPage.createdAt;
      return someStats
    }
    render() {
      if(!this.props.adminCards){
        return<div></div>
      }
      var total = this.someStats()[0];
      var accountLength = this.someStats()[1];
      var created = this.someStats()[2];
      return (
      	<div className="white-back card-3">
          <h3>This page was created: {created}</h3>
          <h3>Months this page has been active: {accountLength.toString()}</h3>
          <h3>The total amount of gift cards outstanding: {total.toFixed(2)}</h3>
          
      	</div>
      );
    }
}

export default AdminManageBody; 
