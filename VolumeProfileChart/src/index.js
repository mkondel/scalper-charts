
import React from 'react';
import { render } from 'react-dom';
import Chart from './Chart';
import { getData } from "./utils"

const heightFactor = 1
const widthFactor = 1

class ChartComponent extends React.Component {
	updateDimensions() {
		const height = window.innerHeight*heightFactor
		const width = window.innerWidth*widthFactor
		this.setState({ height, width });
	}
	componentDidMount() {
		getData(60).then(a => {
			console.log('loaded 1min candles')
			getData(60*60).then(b => {
				console.log('loaded 1hr candles')
				getData(60*15).then(c => {
					console.log('loaded 15min candles')
					getData(60*60*24).then(d => {
						console.log('loaded 1day candles')
						this.setState({ a, b, c, d }, ()=>{
							this.updateDimensions();
							window.addEventListener("resize", this.updateDimensions.bind(this));
						})
					})
				})
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

		return <div>
			<div className='panes'>
	{this.state.a?
				<Chart 
					type='hybrid'
					data={this.state.a} 
					height={this.state.height/2}
					width={this.state.width/2}
					maxCandles={100}
					volumeProfileBins={24}
				/> : 'loading 1min candles'}
	{this.state.b?
				<Chart 
					type='hybrid'
					data={this.state.b} 
					height={this.state.height/2}
					width={this.state.width/2}
					maxCandles={100}
					volumeProfileBins={24}
				/>: 'loading 15min candles'}
			</div>
			<div className='panes'>
	{this.state.c?
				<Chart 
					type='hybrid'
					data={this.state.c} 
					height={this.state.height/2}
					width={this.state.width/2}
					maxCandles={100}
					volumeProfileBins={24}
				/>: 'loading 1hr candles'}
	{this.state.d?
				<Chart 
					type='hybrid'
					data={this.state.d} 
					height={this.state.height/2}
					width={this.state.width/2}
					maxCandles={100}
					volumeProfileBins={24}
				/>: 'loading 1day candles'}
			</div>
		</div>
	}
}

render(
	<ChartComponent />,
	document.getElementById("root")
);
