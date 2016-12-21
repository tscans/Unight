import React, {Component} from 'react';
import AdminAboutMap from './admin_about_map';
import AdminDealsMap from './admin_deals_map';
import AdminGiftsMap from './admin_gifts_map';

class AdminMainCenter extends Component {
    constructor(props){
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
    renderBody(){//no linking with the panels, backend issues need resolving. public private deals. allow or disallow these panels to exist
      if(this.state.header.includes('About')){//about info and maps below it
        return(
          <div>
            <AdminAboutMap about={this.props.pages.aboutUs} allPages={this.props.pages}/>
          </div>
        )
      }
      if(this.state.header.includes('Our')){//Just a list of this particular business deals
        return(
          <div>
            <AdminDealsMap />
          </div>
        )
      }
      if(this.state.header.includes('Gift')){//whatever gift cards they allow
        return(
          <div>
            <AdminGiftsMap pages={this.props.pages}/>
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
        return<div></div>
      }
      console.log(this.props.pages)
        return (
        	<div>
              <div className="panel panel-default card-3">
                  <div className="panel-heading">
                      <div className="bud-left">
                          <h2>
                          {this.props.pages.orgName}
                          </h2>
                      </div>
                      <br />
                      <div className="bud-left">
                        <div className="bud-left pull-inline push-img-down">
                            <img src={this.props.pages.proPict} className="panel-body card-3 surround" height="200" width="200"/>
                        </div>
                        <div className="pull-inline obj-buffer-sides">
                            <h5>Number of Members: {this.props.pages.pageUsers.length}</h5> 
                            <h5>{this.props.pages.phyAddress}</h5>
                            <h5><a className="white-blue" href={this.props.pages.website}>{this.props.pages.website}</a></h5>
                            {this.renderIfMembers()}
                        </div>
                      </div>
                  </div>
                  <div className="panel-body top-bot-long-not">
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
        );
    }
}

export default AdminMainCenter; 
