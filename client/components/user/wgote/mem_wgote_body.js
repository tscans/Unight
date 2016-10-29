import React from 'react';
import MemWgotePage from './mem_wgote_page';
import {Link} from 'react-router';

class MemWgoteBody extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            iDPass: this.props.params.pageId
        }
    }
    render() {
        console.log(this.state.iDPass)
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
        			</div>
        		</div>
        	</div>
        );
    }
}

export default MemWgoteBody;