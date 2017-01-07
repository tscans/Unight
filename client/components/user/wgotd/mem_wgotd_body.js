import React from 'react';
import MemWgotdPage from './mem_wgotd_page';
import {browserHistory} from 'react-router';
import MemWgotdPageG from './mem_wgotd_page_g';
import {createContainer} from 'meteor/react-meteor-data';
import {Profile} from '../../../../imports/collections/profile';
import {TomBook} from '../../../../imports/collections/tombook';

class MemWgotdBody extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            iDPass: this.props.params.pageId,
            gulag: ""
        }
    }
    renderDealType(){
        if(window.location.pathname.includes('wgot/d/')){
            return(
                <MemWgotdPage pageId={this.state.iDPass} />
            )
        }
        else
        {
            return(
                <MemWgotdPageG pageId={this.state.iDPass} />
            )
        }
    }
    addDeal(props){
        var deid = this.props.params.pageId;
        var type;
        if(window.location.pathname.includes('wgot/d/')){
            type = "D";
        }
        else
        {
            type = "G";
        }
        Meteor.call('tombook.updateBook', deid, type, (error, data) => {
            if(error){
                console.log(error)
                console.log(error.error)
                if(error.error == 501){
                    this.setState({gulag: "Sorry. You can not add this deal to your TomBook because you are not a member of this organization."})
                    $('#myModal').modal('show'); 
                }
                if(error.error == 509){
                    this.setState({gulag: "User already used this deal."})
                    $('#myModal').modal('show'); 
                }
            }
            else{
                console.log('Success')
            }
        })
    }
    removeDeal(props){
        var deid = this.props.params.pageId;
        Meteor.call('tombook.removeItem', deid, (error, data) => {
            if(error){
                console.log(error)
            }
            else{
                console.log('Success')
            }
        })
    }
    renderButton(){
        var deid = this.props.params.pageId;
        var cont = false;
        console.log(this.props.tombook)
        this.props.tombook.tbc.map((t)=>{
            if(t.theID == deid){
                cont = true;
            }
        })
        if(cont){
            return(
                <button className="btn btn-danger btn-extend" onClick={this.removeDeal.bind(this)}><h4><span className="glyphicon glyphicon-minus-sign"></span> Remove from TomBook</h4></button>
            )
        }
        else{
            return(
                <button className="btn btn-success btn-extend" onClick={this.addDeal.bind(this)}><h4><span className="glyphicon glyphicon-plus-sign"></span> Add to TomBook</h4></button>
            )
        }
    }
    noAccessCheck(){
        return (
            <div>
                <div className="modal fade all-black" id="myModal" role="dialog">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                        <h4 className="modal-title">Deal Not Added</h4>
                      </div>
                      <div className="modal-body">
                        <p>{this.state.gulag}</p>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                      </div>
                    </div>
                  </div>
                </div>
            </div>
        )
    }
    render() {
        console.log(this.state.iDPass)
        if(!this.props.tombook){
            return(<div></div>)
        }
        console.log(this.props)
        return (
            <div>
                <div className="col-md-6" className="container-fluid bg-3 text-center bump-push-bar up-a-tad">
                    <div className="map-push">
                        {this.noAccessCheck()}
                        <div className="card-2">
                            <a href="#" onClick={browserHistory.goBack}><button className="btn btn-primary btn-extend"><h4><span className="glyphicon glyphicon-arrow-left"></span> Back</h4></button></a>
                        </div>
                        <div className="col-md-12 card-2 top-bot-not">
                            {this.renderDealType()}
                        </div>
                        <div className="card-2">
                            {this.renderButton()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default createContainer((props)=>{
    Meteor.subscribe('profile');
    Meteor.subscribe('tombook');

    return {profile: Profile.find({}), tombook: TomBook.findOne({})}

    
}, MemWgotdBody);  