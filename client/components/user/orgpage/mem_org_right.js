import React, {Component} from 'react';

class MemOrgRight extends Component {
    constructor(props){
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

    render() {
      if(!this.props.pages){
        return <div>loading</div>
      }
        return (
        	<div>
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
                        
                        <div className="panel panel-primary card-3">
                          <div className="panel-heading">
                            <h3 className="panel-title">Deal 1</h3>
                          </div>
                          <div className="panel-body">
                            I am deal info
                          </div>
                        </div>
                        <div className="panel panel-primary card-3">
                          <div className="panel-heading">
                            <h3 className="panel-title">Deal 2</h3>
                          </div>
                          <div className="panel-body">
                            I am deal info
                          </div>
                        </div>
                        <div className="panel panel-primary card-3">
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
        	</div>
        );
    }
}

export default MemOrgRight; 
