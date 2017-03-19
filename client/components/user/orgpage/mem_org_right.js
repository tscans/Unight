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
        body: this.props.pages.aboutUs,
        custCard: null,
        returnedOnce: false

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
    toFinance(){
      $('#myModal').modal('hide');
      browserHistory.push('/user/finance');
    }
    renderIfMembers(){
      if(this.props.pages.hasMembers){
        return(<h5>This organization offers rewards.</h5>)
      }
      else{
        return(<h5>This organization does not offer rewards.</h5>)
      }
    }
    renderCashReward(){
      console.log('here')
      return(
        <div>
          <div className="modal fade all-black" id="theM" role="dialog">
                <div className="modal-dialog">
                  <div className="modal-content">
                    <div className="modal-header">
                      <button type="button" className="close" data-dismiss="modal">&times;</button>
                      <h4 className="modal-title">Enter Code</h4>
                    </div>
                    <div className="modal-body modal-height">
                      <div className="col-md-12">
                        <div className="input-group card-1">
                        <input type="number" ref="code" className="form-control code-input" placeholder="Enter Rewards Code" />
                      </div>
                      </div>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-success" onClick={this.handleCode.bind(this)}>Enter Code</button>
                      <button type="button" className="btn btn-default" data-dismiss="modal">Cancel</button>
                    </div>
                  </div>
                </div>
            </div>
        </div>
      )
    }
    openModal(){
      $('#theM').modal('toggle');
    }
    handleCode(){
      var code = this.refs.code.value.trim();
      code = parseInt(code);
      var pageID = this.props.pageID;
      Meteor.call('pagedata.redeemCode', code, pageID, (error,data)=>{
        if(error){
          console.log(error);
          Bert.alert( error.message, 'danger', 'growl-bottom-right' );
        }
        else{
          console.log(data);
          this.openModal();
          Bert.alert( 'Code Redeemed.', 'success', 'growl-bottom-right' );
          this.refs.code.value = "";
        }
      })
    }
    handleFavPage(){
      if(this.props.pro.favPages.includes(this.props.pageID)){
        Meteor.call('profile.removeFavPage', this.props.pageID,(error,data)=>{
          if(error){
            console.log(error);
          }
          else{
            console.log(data);
          }
        })
        
      }
      else{
        Meteor.call('profile.addFavPage', this.props.pageID,(error,data)=>{
          if(error){
            console.log(error);
          }
          else{
            console.log(data);
          }
        })
      }
    }
    renderFav(){
      if(this.props.pro.favPages.includes(this.props.pageID)){
        return(
          <div className="card-2">
              <button onClick={this.handleFavPage.bind(this)} className="btn btn-danger btn-extend"><h4><span className="glyphicon glyphicon-remove"></span> Remove From Favorite Pages</h4></button>
          </div>
        )
      }
      else{
        return(
          <div className="card-2">
            <button onClick={this.handleFavPage.bind(this)} className="btn btn-success btn-extend"><h4><span className="glyphicon glyphicon-ok"></span> Add To Favorite Pages</h4></button>
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
                            <h5>{this.props.pages.phyAddress}</h5>
                            <h5><a className="white-blue" href={this.props.pages.website}>{this.props.pages.website.substring(0,25)+"..."}</a></h5>
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
              {this.renderFav()}
              {this.renderCashReward()}
              <div className="card-2">
                <a href="#" onClick={this.openModal.bind(this)}><button className="btn btn-default btn-extend"><h4><span className="glyphicon glyphicon-transfer"></span> Redeem Rewards Code</h4></button></a>
              </div>
        	</div>
        );
    }
}

export default MemOrgRight; 
