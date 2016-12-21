import React, {Component} from 'react'; 
import AdminMainCenter from './admin_main_center';
import {createContainer} from 'meteor/react-meteor-data';
import {Profile} from '../../../../imports/collections/profile';
import {Pages} from '../../../../imports/collections/pages';
import AdminMainRight from './admin_main_right';
import AdminMainLeft from './admin_main_left';
import AdminMainEdit from './admin_main_edit';

class AdminMainBody extends Component {
    render() {
        console.log(this.props.profile);
        if(!this.props.profile){
            return(
                <div>loading...</div>
            )
        }
        return (
        <div>
            <div className="container-fluid bg-3 text-center">
                <div className="col-md-6">
                    <div className="dat-gap"></div>
                    <AdminMainEdit profile={this.props.profile} back={this.editBtn} pages={this.props.pages} />
                </div>
                <div className="col-md-6">
                    <div className="dat-gap"></div>
                    <AdminMainCenter profile={this.props.profile} pages={this.props.pages} />   
                </div>
            </div>
        </div>
    );
        
    }
}

export default createContainer((props)=>{
	const theId = Meteor.userId();
    var str = window.location.pathname;
    var res = str.substring(7, str.length - 1);
    console.log(res)
    var pageID = res;
	Meteor.subscribe('profile');
    Meteor.subscribe('pages');

    return {profile: Profile.findOne({}), pages: Pages.findOne({_id: pageID})}

	
}, AdminMainBody); 


