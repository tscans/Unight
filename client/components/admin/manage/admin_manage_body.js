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
    potCost(){
      var total = 0;
      var hold = this.props.allPages;
      console.log(hold)
      for(var i = 0; i< hold.length; i++){
        total = total + hold[i].monthlyTransactions;
      }
      return total;
    }
    calculateCharge(){
      var samount = 0;
      var totalNumTrans = this.potCost();
      if(totalNumTrans < 11){
        samount = totalNumTrans * .5;
      }
      else if(totalNumTrans < 21){
        samount = ((totalNumTrans-10)*.4)+(10*.5);
      }
      else if(totalNumTrans < 31){
        samount = ((totalNumTrans - 20)* .3)+(10*.5)+(10*.4);
      }
      else{
        samount = ((totalNumTrans-30)*.25)+(10*.5)+(10*.4)+(10*.3);
      }
      if(samount < 5){
        samount = 0;
      }
      return samount;
    }
    render() {
      if(!this.props.adminCards){
        return<div></div>
      }
      var total = this.someStats()[0]
      var numUsers = this.someStats()[1]
      var cost = this.calculateCharge().toFixed(2).toString();
      return (
      	<div>
          <h3>The total amount of gift cards outstanding: {total.toFixed(2)}</h3>
          <h3>Number of Members to Page: {numUsers}</h3>
          <h3>What you owe this month so far from {this.potCost().toString()} deals: ${cost}</h3>
      	</div>
      );
    }
}

export default AdminManageBody; 
