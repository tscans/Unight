import React, {Component} from 'react';
import {Link, browserHistory} from 'react-router';
import MemGiftsMap from './mem_gifts_map';
import MemDealsMap from './mem_deals_map';
import MemAboutMap from './mem_about_map';

class MemOrgRight extends Component {
    constructor(props){
      Stripe.setPublishableKey(Meteor.settings.public.StripePub);
      super(props);
      this.state = {
        header: 'About Us',
        body: this.props.pages.aboutUs

      }
    }
    about(){
      this.setState({header: 'About Us'})
    }
    deals(){
      this.setState({header: 'Our Deals'})
    }
    gifts(){
      this.setState({header: 'Gift Cards'})
    }
    goldMember(){
      var d = this.props.pageID;
      var cardDetails = {
        "number": this.refs.cred.value.trim(),
        "cvc": this.refs.cvc.value.trim(),
        "exp_month": this.refs.mm.value.trim(),
        "exp_year": this.refs.yy.value.trim()
      }
      //temporarily broken

      Meteor.call('pages.addGoldMember', d, (error,data)=>{
        if(error){
          console.log(error)
        }
        else{
          console.log(data)
          $('#myModal').modal('hide');
          alert("You were successfully charged: $5.00");
        }
      })
      return;
      Stripe.createToken(cardDetails, function(status, result){
        if(result.error){
          alert(result.error.message);
        }
        else{
          Meteor.call("chargeCard", result.id, function(error,response){
            if(error){
              alert(error.message);
            }
            else{
              console.log(result)
              console.log(response)
              
              Meteor.call('pages.addGoldMember', d, (error,data)=>{
                if(error){
                  console.log(error)
                }
                else{
                  console.log(data)
                  alert("You were successfully charged: $5.00");
                  $('#myModal').modal('hide');
                }
              })
            }
          })
        }
      })
    }
    offGoldMember(){
      var d = this.props.pageID;
      Meteor.call('pages.removeGoldMember', d, (error,data)=>{
        if(error){
          console.log(error)
        }
        else{
          console.log(data)
          $('#myModal').modal('hide');
        }
      })
      
    }
    renderBody(){//no linking with the panels, backend issues need resolving. public private deals. allow or disallow these panels to exist
      if(this.state.header.includes('About')){//about info and maps below it
        return(
          <div>
            <MemAboutMap about={this.props.pages.aboutUs} allPages={this.props.pages}/>
          </div>
        )
      }
      if(this.state.header.includes('Our')){//Just a list of this particular business deals
        return(
          <div>
            <MemDealsMap pageID={this.props.pageID} />
          </div>
        )
      }
      if(this.state.header.includes('Gift')){//whatever gift cards they allow
        return(
          <div>
            <MemGiftsMap pages={this.props.pages} pageID={this.props.pageID} profile={this.props.pro}/>
          </div>
        )
      }
      
    }
    renderTitle(){
      return(
        <div className="panel-heading">
          <h3 className="panel-title">{this.state.header}</h3>
        </div>
      )
    }
    renderBtnDeal(){
      if(this.props.pages.hasDeals){
        return(
          <button className="btn btn-primary third-length card-1" onClick={this.deals.bind(this)}>Deals</button>
        )
      }
      else{
        return<button className="btn btn-primary third-length card-1">-</button>
      }
    }
    renderBtnGift(){
      if(this.props.pages.hasGiftCards){
        return(
          <button className="btn btn-primary third-length card-1" onClick={this.gifts.bind(this)}>Gift Cards</button>
        )
      }
      else{
        return<button className="btn btn-primary third-length card-1">-</button>
      }
    }
    renderButton(){
      if(!this.props.pages.hasMembers){
        return<div></div>
      }
      else{
        if(!this.props.pages.pageUsers.includes(Meteor.userId())){
        return(
          <div>
            <div className="card-2">
              <button className="btn btn-success btn-extend" data-toggle="modal" data-target="#myModal">
                <h4><span className="glyphicon glyphicon-credit-card"></span> Become a Gold Member</h4>
              </button>
            </div>
            <div className="modal fade all-black" id="myModal" role="dialog">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                        <h4 className="modal-title">Become a Gold Member</h4>
                      </div>
                      <div className="modal-body">
                        <p>In order to become a Gold Member of {this.props.pages.orgName}, please fill out the following fields.</p>
                        <label htmlFor="exampleInputEmail1">Card Number</label>
                        <input type="text" className="form-control foc-card" ref="cred" placeholder="Card Number"/>
                        <label htmlFor="exampleInputEmail1">CVC</label>
                        <input type="text" className="form-control foc-card" ref="cvc" placeholder="CVC"/>
                        <label htmlFor="exampleInputEmail1">Expiration MM</label>
                        <input type="text" className="form-control foc-card" ref="mm" placeholder="MM"/>
                        <label htmlFor="exampleInputEmail1">Expiration YY</label>
                        <input type="text" className="form-control foc-card" ref="yy" placeholder="YY"/>
                      </div>
                      <div className="modal-footer">
                        <button type="button" onClick={this.goldMember.bind(this)} className="btn btn-success">Become Gold Member</button>
                        <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                      </div>
                    </div>
                  </div>
              </div>
          </div>
        )
      }
      else{
        return(
          <div>
            <div className="card-2">
              <button className="btn btn-danger btn-extend" data-toggle="modal" data-target="#myModal">
                <h4><span className="glyphicon glyphicon-credit-card"></span> End Membership</h4>
              </button>
            </div>
            <div className="modal fade all-black" id="myModal" role="dialog">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                        <h4 className="modal-title">End Membership</h4>
                      </div>
                      <div className="modal-body">
                        <p>Are you sure you want to end your membership with {this.props.pages.orgName}?</p>
                      </div>
                      <div className="modal-footer">
                        <button type="button" onClick={this.offGoldMember.bind(this)} className="btn btn-danger">End Membership</button>
                        <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                      </div>
                    </div>
                  </div>
              </div>
          </div>
        )
      }
      }
    }
    renderIfMembers(){
      if(this.props.pages.hasMembers){
        return(<h5>This organization offers memberships.</h5>)
      }
      else{
        return(<h5>This organization does not offer memberships.</h5>)
      }
    }
    render() {
      if(!this.props.pages){
        return <div>loading</div>
      }
        return (
        	<div>
            <div className="card-2">
                <a href="#" onClick={browserHistory.goBack}><button className="btn btn-primary btn-extend"><h4><span className="glyphicon glyphicon-arrow-left"></span> Back</h4></button></a>
            </div>
            <br/>
              <div className="panel panel-default card-3">
                  <div className="panel-heading header-page">
                      <div className="bud-left">
                          <h2>
                          {this.props.pages.orgName}
                          </h2>
                      </div>
                      <br />
                      <div>
                        <div className="col-md-6 push-img-down">
                            <img src={this.props.pages.proPict} className="panel-body card-3 surround" height="200" width="200"/>
                        </div>
                        <div className="col-md-6 push-img-down">
                            <h5>Number of Members: {this.props.pages.pageUsers.length}</h5> 
                            <h5>{this.props.pages.phyAddress}</h5>
                            <h5><a className="white-blue" href={this.props.pages.website}>{this.props.pages.website}</a></h5>
                            {this.renderIfMembers()}
                        </div>
                      </div>
                  </div>
                  <div className="panel-body top-bot-long-not">
                      <div>
                        <div className="col-md-10 col-md-offset-1">
                        <button className="btn btn-primary third-length card-1" onClick={this.about.bind(this)}>About</button>
                        {this.renderBtnDeal()}
                        {this.renderBtnGift()}
                        <div className="panel panel-default card-3">
                          {this.renderTitle()}
                          {this.renderBody()}
                        </div>
                      </div>
                        
                       
                      </div>
                  </div>
              </div>
              {this.renderButton()}
        	</div>
        );
    }
}

export default MemOrgRight; 
