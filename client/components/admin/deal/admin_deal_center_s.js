import React from 'react';
import ImageUploadS from './image_upload_s';
import DatePicker from "react-bootstrap-date-picker";

class AdminDealCenterS extends React.Component {
    constructor(props){
		super(props);
		var value = new Date().toISOString();
		this.state = {
			silver: {
				title: '',
				desc: '',
			},
			checker: false,
			value: value
		}
	}
	check(){
		this.setState({checker: !this.state.checker})
	}
	
	editPageData(event){
		event.preventDefault();
		var title = this.refs.title.value;
        var desc = this.refs.desc.value;
        var expi = this.state.value;

        var str = window.location.pathname;
	    var res = str.substring(7, str.lastIndexOf('/deal'));
	    var pageID = res;

        var str = window.location.pathname;
	    var res = str.substring(str.lastIndexOf('/deal')+14, str.length - 1);
	    var dealID = res;
	    
	    var checkb = this.state.checker;
        
		Meteor.call('dande.updateDandE', pageID, dealID, title, desc, expi, checkb, (error, data) => {
			if(error){
        		console.log("There was an error");
        		console.log(error);
            }
            else{
            	console.log('completed without error')
            }
		});
	}
	changeDefault(){
		console.log('here')
		this.refs.title.value = this.props.deals.title;
		this.refs.desc.value = this.props.deals.description;
		this.setState({checker: this.props.deals.dealsOn});
		console.log('here', this.state.checker)
	}
	handleChange(value){
		this.setState({
	      value: value
	    });
	    console.log(value)
	}
    render() {
    	if(!this.props.deals){
    		return <div></div>
    	}
    	
        return (
        	<div>
        		<button onClick={this.changeDefault.bind(this)} className="btn btn-success card-1 top-bot-not"><span className="glyphicon glyphicon-ok"></span> Show Current</button>
        		<form className="card-3 white-back" onSubmit={this.editPageData.bind(this)}>
    			<div className="lower"></div>
	    			<div className="col-md-10 col-md-offset-1">
					  <div className="form-group">
					    <label htmlFor="exampleInputEmail1">Deal Title</label>
					    <input type="text" className="form-control foc-card" ref="title" defaultValue={this.state.silver.title} placeholder="Deal Title"/>
					  </div>
					  <div className="form-group">
					    <label htmlFor="exampleInputEmail1">Description</label>
					    <input type="text" className="form-control foc-card" ref="desc" defaultValue={this.state.silver.desc} placeholder="Deal Description"/>
					  </div>
					  <div className="form-group">
					    <label htmlFor="exampleInputEmail1">Do you want to offer this deal now?</label>
					    <input type="checkbox" className="form-control" ref="cb" onClick={this.check.bind(this)} checked={this.state.checker}/>
					  </div>
					  <div className="form-group foc-card">
					  	<DatePicker ref="expi" value={this.state.value} onChange={this.handleChange.bind(this)} />
					  </div>
				  </div>
				  <button type="submit" className="btn btn-primary card-1 top-bot-not"><span className="glyphicon glyphicon-ok"></span> Save Changes</button>
				<div className="form-group">
				    <label htmlFor="exampleInputEmail1">Deal Picture <i>(image upload/save occurs immediately)</i></label>
				    <div className="center-div">
				    	<ImageUploadS />
				    </div>
				  </div>
				</form>
        	</div>
        );
    }
}

export default AdminDealCenterS;
