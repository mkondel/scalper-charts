
import React from 'react';
import { render } from 'react-dom';
import Chart from './Chart';
import { getData } from "./utils"

import { TypeChooser } from "react-stockcharts/lib/helper";

const heightFactor = 0.8

class ChartComponent extends React.Component {
	updateDimensions() {
		const height = window.innerHeight*heightFactor
		this.setState({ height });
	}
	componentDidMount() {
		getData().then(data => {
			this.setState({ data }, ()=>{
				this.updateDimensions();
		    	window.addEventListener("resize", this.updateDimensions.bind(this));
			})
		})
	}
	 componentWillUnmount() {
    	window.removeEventListener("resize", this.updateDimensions.bind(this));
 	}
	render() {
		console.log(Object.keys(window))
		if (this.state == null) {
			return <div>Loading...</div>
		}
		return (
			<TypeChooser>
				{type => <Chart type={type} data={this.state.data} height={this.state.height}/>}
			</TypeChooser>
		)
	}
}

render(
	<ChartComponent />,
	document.getElementById("root")
);
