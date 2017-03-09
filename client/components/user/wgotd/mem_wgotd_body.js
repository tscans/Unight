import React from 'react';
import MemWgotdPage from './mem_wgotd_page';
import {browserHistory} from 'react-router';
import MemWgotdPageG from './mem_wgotd_page_g';
import {createContainer} from 'meteor/react-meteor-data';
import {Profile} from '../../../../imports/collections/profile';
import {TomBook} from '../../../../imports/collections/tombook';
import {DandE} from '../../../../imports/collections/dande';

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
                <MemWgotdPageG pageId={this.state.iDPass} wgot={this.props.wgot}/>
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
                if(error.error == 509){
                    Bert.alert( "User already used this deal.", 'danger', 'growl-bottom-right' );
                }
                else{
                    Bert.alert( error.message, 'danger', 'growl-bottom-right' );
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
    checkGD(props){
        var deid = this.props.params.pageId;
        if(window.location.pathname.includes('wgot/d/')){
            this.addDeal(props);
        }
        else
        {
            $('#buyModal').modal('toggle');
        }
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
        if(this.props.wgot.usedBy.includes(Meteor.userId())){
            Bert.alert( "User already used this deal.", 'danger', 'growl-bottom-right' );
            return
        }
        if(cont){
            return(
                <button className="btn btn-danger btn-extend" onClick={this.removeDeal.bind(this)}><h4><span className="glyphicon glyphicon-minus-sign"></span> Remove from UBook</h4></button>
            )
        }
        else{
            return(
                <button className="btn btn-success btn-extend" onClick={this.checkGD.bind(this)}><h4><span className="glyphicon glyphicon-plus-sign"></span> Add to UBook</h4></button>
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
    buyDeal(){
        return (
            <div>
                <div className="modal fade all-black" id="buyModal" role="dialog">
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <button type="button" className="close" data-dismiss="modal">&times;</button>
                        <h4 className="modal-title">Buy Ready Deal</h4>
                      </div>
                      <div className="modal-body">
                        <h2>Cost: ${this.props.wgot.cost.toFixed(2).toString()}</h2>
                      </div>
                      <div className="modal-footer">
                        <button type="button" className="btn btn-success" onClick={this.addDeal.bind(this)}>Purchase</button>
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
        console.log(this.props.wgot)
        if(!this.props.tombook || !this.props.wgot){
            return(<div></div>)
        }
        return (
            <div>
                <div className="col-md-6" className="container-fluid bg-3 text-center bump-push-bar up-a-tad">
                    <div className="map-push">
                        {this.noAccessCheck()}
                        {this.buyDeal()}
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
    Meteor.subscribe('wgot');

    return {profile: Profile.find({}), tombook: TomBook.findOne({}), wgot: DandE.findOne({_id: props.params.pageId })}

    
}, MemWgotdBody);  