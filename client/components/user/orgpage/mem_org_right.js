import React, {Component} from 'react';
import {Link, browserHistory} from 'react-router';

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
      this.setState({header: 'About Us', body: this.props.pages.aboutUs})
    }
    menu(){
      this.setState({header: 'Menu', body: this.props.pages.menu})
    }
    reviews(){
      this.setState({header: 'Reviews', body: this.props.pages.reviews})
    }
    goldMember(){
      var d = this.props.pageID;
      var cardDetails = {
        "number": this.refs.cred.value.trim(),
        "cvc": this.refs.cvc.value.trim(),
        "exp_month": this.refs.mm.value.trim(),
        "exp_year": this.refs.yy.value.trim()
      }
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
    renderButton(){

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
                  <div className="panel-heading">
                      <div className="bud-left">
                          <h3>
                          {this.props.pages.orgName}
                          </h3>
                      </div>
                      <br />
                      <div className="bud-left">
                        <div className="bud-left pull-inline push-img-down">
                            <img src={this.props.pages.proPict} className="panel-body card-3 surround" height="200" width="200"/>
                        </div>
                        <div className="pull-inline obj-buffer-sides">
                            <h4>{this.props.pages.orgName}</h4>
                            <h5>Rating</h5>
                        </div>
                      </div>
                  </div>
                  <div className="panel-body top-bot-long-not">
                      <div className="col-md-10 col-md-offset-1">
                        <button className="btn btn-primary third-length card-1" onClick={this.about.bind(this)}>About</button>
                        <button className="btn btn-primary third-length card-1" onClick={this.menu.bind(this)}>Menu</button>
                        <button className="btn btn-primary third-length card-1" onClick={this.reviews.bind(this)}>Reviews</button>
                        <div className="panel panel-default card-3">
                          <div className="panel-heading">
                            <h3 className="panel-title">{this.state.header}</h3>
                          </div>
                          <div className="panel-body">
                          {this.state.body}
                          </div>
                        </div>
                        
                        <div className="panel panel-primary card-1">
                          <div className="panel-heading">
                            <h3 className="panel-title">Deal 1</h3>
                          </div>
                          <div className="panel-body">
                            I am deal info
                          </div>
                        </div>
                        <div className="panel panel-primary card-1">
                          <div className="panel-heading">
                            <h3 className="panel-title">Deal 2</h3>
                          </div>
                          <div className="panel-body">
                            I am deal info
                          </div>
                        </div>
                        <div className="panel panel-primary card-1">
                          <div className="panel-heading">
                            <h3 className="panel-title">Deal 3</h3>
                          </div>
                          <div className="panel-body">
                            I am deal info
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
