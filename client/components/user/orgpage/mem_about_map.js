import React from 'react';

class MemAboutMap extends React.Component {
	render(){
		if(!this.props.allPages){
			return<div></div>
		}
		console.log(this.props)
		return(
			<div>
				<p>{this.props.about}</p>
			</div>
		)
	}
}

export default MemAboutMap;