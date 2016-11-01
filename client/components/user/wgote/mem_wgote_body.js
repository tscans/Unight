import React from 'react';
import MemWgotePage from './mem_wgote_page';
import {Link} from 'react-router';
import {createContainer} from 'meteor/react-meteor-data';
import {Profile} from '../../../../imports/collections/profile';
import {TomBook} from '../../../../imports/collections/tombook';

class MemWgoteBody extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            iDPass: this.props.params.pageId
        }
    }
    addDeal(props){
        var deid = this.props.params.pageId;
        var type = "E";
        
        Meteor.call('tombook.updateBook', deid, type, (error, data) => {
            if(error){
                console.log(error)
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
    render() {
        console.log(this.state.iDPass)
        if(!this.props.tombook){
            return(<div></div>)
        }
        return (
        	<div>
        		<div className="col-md-6" className="container-fluid bg-3 text-center bump-push-bar up-a-tad">
        			<div className="map-push">
                        <div className="card-1">
                            <Link to="/user/wgot"><button className="btn btn-primary btn-extend"><h4><span className="glyphicon glyphicon-arrow-left"></span> Back</h4></button></Link>
                        </div>
                        <br/>
                        <div className="col-md-12 card-2">
        				    <MemWgotePage pageId={this.state.iDPass} />
                        </div>
                        <br />
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

    
}, MemWgoteBody);  